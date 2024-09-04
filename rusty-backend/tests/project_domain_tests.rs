
use anyhow::anyhow;
use pretty_assertions::assert_eq;
use rusty_backend::{domains::{project_domain::CreateProject, ProjectDomain}, repositories::{project_repository::{SyncArtifacts, UpdateProjectUiFields}, Project, ProjectTemplate}};
use serde_json::json;
use sqlx::query_as;

use crate::common::TestContext;

mod common;

#[tokio::test]
async fn create_new_project() -> anyhow::Result<()> {
    let context = TestContext::new().await;

    let project_without_artifacts = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;
    Project::get_id_from_project_uuid(project_without_artifacts.project_id, context.app_state.repository_manager.db()).await?.unwrap();

    Ok(())
}

#[tokio::test]
async fn create_new_project_from_template() -> anyhow::Result<()> {
    let context = TestContext::new().await;
    let rm = &context.app_state.repository_manager;

    let project_template = query_as!(
        ProjectTemplate,
        r#"
       	insert into project_templates(name, description, project_art, project_artifacts)
        values('t1', 'td1', '{"key": "art"}', '{"key": "artifacts"}')
        returning *;
        "#
    ).fetch_one(rm.db()).await?;

    let project_without_artifacts = ProjectDomain::create_project(CreateProject{ template_id: Some(project_template.id) }, &context.app_state).await?;
    let project = query_as!(
        Project,
        r#"
       	select * from projects where project_id = $1
        "#,
        project_without_artifacts.project_id
    ).fetch_one(rm.db()).await?;

    assert_eq!(project.name, "t1");
    assert_eq!(project.description, "td1");
    assert_eq!(project.project_art.as_object().unwrap().get("key").unwrap(), "art");
    assert_eq!(project.project_artifacts.as_object().unwrap().get("key").unwrap(), "artifacts");

    Project::get_id_from_project_uuid(project_without_artifacts.project_id, context.app_state.repository_manager.db()).await?.unwrap();
    Ok(())
}

#[tokio::test]
async fn get_project_with_and_without_artifacts() -> anyhow::Result<()> {
    let context = TestContext::new().await;

    let project = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;

    ProjectDomain::get_without_artifacts(project.project_id, &context.app_state).await?;
    ProjectDomain::get_with_artifacts(project.project_id, &context.app_state).await?;

    Ok(())
}

#[tokio::test]
async fn find_viewable_projects() -> anyhow::Result<()> {
    let context = TestContext::new().await;

    let project1 = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;
    let project2 = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;

    let projects = ProjectDomain::find_viewable_projects(&context.app_state).await?;

    assert_eq!(projects.len(), 2);

    //Reverse order check because find query sorts desc
    assert_eq!(project1.project_id, projects[1].project_id);
    assert_eq!(project2.project_id, projects[0].project_id);


    Ok(())
}

#[tokio::test]
async fn update_project() -> anyhow::Result<()> {
    let context = TestContext::new().await;

    let project = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;
    let update_project_query = UpdateProjectUiFields {
        name: Some("new_name".into()),
        description: None,
        project_art: None,
    };
    let updated_project = ProjectDomain::update_ui_fields(project.project_id, update_project_query, &context.app_state).await?;

    assert_eq!(updated_project.description, project.description);
    assert_eq!(updated_project.project_art, project.project_art);
    assert_eq!(updated_project.name, "new_name");

    Ok(())
}


#[tokio::test]
async fn sync_project() -> anyhow::Result<()> {
    let context = TestContext::new().await;

    //-- Syncing should be successful and should get updated server_sequence

    let project = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;
    let mut project_with_artifacts = ProjectDomain::get_with_artifacts(project.project_id, &context.app_state).await?;

    let updated_artifacts = project_with_artifacts.project_artifacts.as_object_mut().ok_or(anyhow!("Could not get artifacts as object"))?;
    updated_artifacts.insert("test_key".into(), "test_value".into());

    let new_server_sequence = project_with_artifacts.server_sequence + 1;
    let sync_artifacts_request = SyncArtifacts {
        new_server_sequence,
        project_artifacts: json!(updated_artifacts)
    };

    let sync_result = ProjectDomain::sync_artifacts(project.project_id, sync_artifacts_request, &context.app_state).await?;
    assert_eq!(sync_result.server_sequence, new_server_sequence);

    //-- Syncing should reflect changes in database
    {
        let project_with_artifacts = ProjectDomain::get_with_artifacts(project.project_id, &context.app_state).await?;
        let (previously_sent_key, previously_sent_value) = project_with_artifacts.project_artifacts.as_object().unwrap().get_key_value("test_key").unwrap();

        assert_eq!(previously_sent_key, "test_key");
        assert_eq!(previously_sent_value, "test_value");
    }


    //-- Syncing should be fail since sent version is older tha one in db

    let sync_artifacts_request = SyncArtifacts {
        new_server_sequence: sync_result.server_sequence,
        project_artifacts: json!(updated_artifacts)
    };
    let result = ProjectDomain::sync_artifacts(project.project_id, sync_artifacts_request, &context.app_state).await;
    let error = result.err().ok_or(anyhow!("Should have failed since sequence number is whack!"))?;

    assert_eq!(error.as_ref(), "SyncError");

    //-- Syncing should be successful but we should get an older server_sequence since db didn't have anything to update

    let sync_artifacts_request = SyncArtifacts {
        new_server_sequence: sync_result.server_sequence + 1,
        project_artifacts: json!(updated_artifacts)
    };
    let result = ProjectDomain::sync_artifacts(project.project_id, sync_artifacts_request, &context.app_state).await?;

    assert_eq!(result.server_sequence, sync_result.server_sequence);

    Ok(())
}

#[tokio::test]
async fn soft_deleted_project_should_be_inaccessible() -> anyhow::Result<()> {
    let context = TestContext::new().await;


    let project = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;
    ProjectDomain::soft_delete(project.project_id, &context.app_state).await?;

    let viewable_projects = ProjectDomain::find_viewable_projects(&context.app_state).await?;
    assert_eq!(viewable_projects.len(), 0);

    let result = ProjectDomain::get_without_artifacts(project.project_id, &context.app_state).await;
    assert!(result.is_err());
    assert_eq!(result.err().unwrap().as_ref(), "NotFound");

    let result = ProjectDomain::get_with_artifacts(project.project_id, &context.app_state).await;
    assert!(result.is_err());
    assert_eq!(result.err().unwrap().as_ref(), "NotFound");

    let result = ProjectDomain::update_ui_fields(project.project_id, UpdateProjectUiFields { name: Some("test".into()), description: None, project_art: None }, &context.app_state).await;
    assert!(result.is_err());
    assert_eq!(result.err().unwrap().as_ref(), "NotFound");

    let result = ProjectDomain::sync_artifacts(project.project_id, SyncArtifacts { new_server_sequence: 2, project_artifacts: json!({}) }, &context.app_state).await;
    assert!(result.is_err());
    assert_eq!(result.err().unwrap().as_ref(), "SyncError");

    ProjectDomain::soft_delete(project.project_id, &context.app_state).await?;

    Ok(())
}

#[tokio::test]
async fn soft_deleted_project_should_be_accessible_to_dedicated_api() -> anyhow::Result<()> {
    let context = TestContext::new().await;


    let project = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;
    ProjectDomain::soft_delete(project.project_id, &context.app_state).await?;

    let viewable_projects = ProjectDomain::find_viewable_projects(&context.app_state).await?;
    assert_eq!(viewable_projects.len(), 0);

    let deleted_projects = ProjectDomain::find_deleted_projects(&context.app_state).await?;
    assert_eq!(deleted_projects.len(), 1);

    assert_eq!(deleted_projects[0].project_id, project.project_id);


    Ok(())
}
