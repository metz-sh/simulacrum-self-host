

use pretty_assertions::assert_eq;
use rusty_backend::{domains::{embed_domain::CreateEmbedResponse, project_domain::CreateProject, EmbedDomain, ProjectDomain}, repositories::Embed};

use sqlx::query_as;

use crate::common::TestContext;

mod common;

#[tokio::test]
async fn create_new_embed() -> anyhow::Result<()> {
    let context = TestContext::new().await;
    let rm = &context.app_state.repository_manager;

    let project_without_artifacts = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;

    //- Even when called multiple times, embed should just be one for a unique project

    let CreateEmbedResponse { embed_id } = EmbedDomain::get_embed_id(project_without_artifacts.project_id, &context.app_state).await?;
    let embeds = query_as!(
        Embed,
        "select * from embeds"
    ).fetch_all(rm.db()).await?;
    assert_eq!(embeds.len(), 1);
    assert_eq!(embeds[0].embed_id, embed_id);

    let CreateEmbedResponse { embed_id } = EmbedDomain::get_embed_id(project_without_artifacts.project_id, &context.app_state).await?;
    let embeds = query_as!(
        Embed,
        "select * from embeds"
    ).fetch_all(rm.db()).await?;
    assert_eq!(embeds.len(), 1);
    assert_eq!(embeds[0].embed_id, embed_id);

    Ok(())
}

#[tokio::test]
async fn get_project_from_embed() -> anyhow::Result<()> {
    let context = TestContext::new().await;

    let project_without_artifacts = ProjectDomain::create_project(CreateProject{ template_id: None }, &context.app_state).await?;

    //- Even when called multiple times, embed should just be one for a unique project

    let CreateEmbedResponse { embed_id } = EmbedDomain::get_embed_id(project_without_artifacts.project_id, &context.app_state).await?;
    let _ = EmbedDomain::get_embedded_project_for_embed_id(embed_id, &context.app_state).await?;

    Ok(())
}
