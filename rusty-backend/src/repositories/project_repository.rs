
use modql::{field::{Fields, HasFields}, SIden};
use sea_query::{enum_def, Expr, IntoIden, PostgresQueryBuilder, Query, TableRef };
use sea_query_binder::SqlxBinder;
use serde::{Deserialize, Serialize};
use sqlx::{
    prelude::FromRow, query, query_as, query_as_with, query_scalar, types::{JsonValue, Uuid}, PgExecutor
};
use time::PrimitiveDateTime;


use super::{pg, RepositoryResponse};

const TABLE: &str = "projects";

#[enum_def]
#[derive(Serialize)]
pub struct Project {
    #[serde(skip)]
    pub id: i32,
    #[serde(serialize_with = "uuid::serde::simple::serialize")]
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: PrimitiveDateTime,
    pub updated_at: PrimitiveDateTime,
    pub project_art: JsonValue,
    pub project_artifacts: JsonValue,
    pub server_sequence: i32,
    pub is_deleted: bool,
}

#[derive(Fields, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UpdateProjectUiFields {
    pub name: Option<String>,
    pub description: Option<String>,
    pub project_art: Option<JsonValue>,
}

#[derive(Deserialize)]
pub struct SyncArtifacts {
    pub new_server_sequence: i32,
    pub project_artifacts: JsonValue,
}

#[derive(Serialize)]
pub struct UpdatedServerSequence {
    pub server_sequence: i32,
}

#[derive(Serialize, FromRow, Debug)]
pub struct ProjectWithoutArtifacts {
    #[serde(serialize_with = "uuid::serde::simple::serialize")]
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub project_art: JsonValue,
}

#[derive(Serialize, FromRow, Debug)]
pub struct ProjectForDisplay {
    #[serde(serialize_with = "uuid::serde::simple::serialize")]
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub project_art: JsonValue,
    pub created_at: PrimitiveDateTime,
    pub updated_at: PrimitiveDateTime,
}

#[derive(Serialize, FromRow, Debug)]
pub struct ProjectWithArtifacts {
    #[serde(serialize_with = "uuid::serde::simple::serialize")]
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub project_art: JsonValue,
    pub project_artifacts: JsonValue,
    pub server_sequence: i32,
}

impl Project {
    pub async fn get_id_from_project_uuid(
        project_uuid: Uuid,
        executor: pg!(),
    ) -> RepositoryResponse<Option<i32>> {
        let id: Option<i32> = query_scalar!("select id from projects where project_id = $1", project_uuid).fetch_optional(executor).await?;
        Ok(id)
    }

    pub async fn get_project_without_artifacts(
        project_id: i32,
        executor: pg!(),
    ) -> RepositoryResponse<Option<ProjectWithoutArtifacts>> {
        query_as!(
            ProjectWithoutArtifacts,
            "select project_id, name, description, project_art from projects where id = $1 and is_deleted=false",
            project_id
        )
        .fetch_optional(executor)
        .await
    }

    pub async fn get_project_with_artifacts(
        project_id: i32,
        executor: pg!(),
    ) -> RepositoryResponse<Option<ProjectWithArtifacts>> {
        query_as!(
            ProjectWithArtifacts,
            "select project_id, name, description, project_art, project_artifacts, server_sequence from projects where id = $1 and is_deleted=false",
            project_id,
        )
        .fetch_optional(executor)
        .await
    }


    pub async fn create_project_from_template_id(template_id: i32, executor: pg!()) -> RepositoryResponse<Option<Project>> {
        query_as!(
            Project,
            r#"
            insert into projects(name, description, project_art, project_artifacts)
            (select name, description, project_art, project_artifacts from project_templates where id = $1)
            returning *
            "#,
            template_id,
        ).fetch_optional(executor).await
    }

    pub async fn create_blank_project(executor: pg!()) -> RepositoryResponse<Project> {
        query_as!(
            Project,
            r#"
            insert into projects(name, description, project_art, project_artifacts)
            values ('Untitled', 'untitled project', '{}', '{ "storySetups": [], "project": [] }')
            returning *
            "#
        ).fetch_one(executor).await
    }

    pub async fn update_ui_fields(project_id: i32, params: UpdateProjectUiFields, executor: pg!()) -> RepositoryResponse<Option<ProjectWithoutArtifacts>> {
        let update_values = params.not_none_fields().for_sea_update();
        let (sql, values) = Query::update()
        .table(TableRef::Table(SIden(TABLE).into_iden()))
        .values(update_values)
        .and_where(Expr::col(ProjectIden::Id).eq(project_id))
        .and_where(Expr::col(ProjectIden::IsDeleted).eq(false))
        .returning(Query::returning().columns([
            ProjectIden::ProjectId,
            ProjectIden::Name,
            ProjectIden::Description,
            ProjectIden::ProjectArt,
        ]))
        .build_sqlx(PostgresQueryBuilder);

        let project: Option<ProjectWithoutArtifacts> = query_as_with(&sql, values).fetch_optional(executor).await?;


        Ok(project)
    }

    pub async fn sync_artifacts(
        project_id: i32, params: SyncArtifacts, executor: pg!()
    ) -> RepositoryResponse<Option<UpdatedServerSequence>> {
        let new_server_sequence: Option<UpdatedServerSequence> = query_as!(
            UpdatedServerSequence,
            r#"
                update projects set project_artifacts = project_artifacts || $1
                where id = $2 and $3 > server_sequence
                and is_deleted=false
                returning server_sequence
            "#,
            params.project_artifacts,
            project_id,
            params.new_server_sequence,
        ).fetch_optional(executor).await?;

        Ok(new_server_sequence)
    }

    pub async fn soft_delete(
        project_id: i32, executor: pg!()
    ) -> RepositoryResponse<()> {
        query!(
            r#"
                update projects set is_deleted = true where id = $1
            "#,
            project_id,
        ).execute(executor).await?;

        Ok(())
    }

    pub async fn restore_soft_deleted_project(
        project_id: i32, executor: pg!()
    ) -> RepositoryResponse<()> {
        query!(
            r#"
                update projects set is_deleted = false where id = $1
            "#,
            project_id,
        ).execute(executor).await?;

        Ok(())
    }

    pub async fn find_viewable_projects(
        executor: pg!(),
    ) -> RepositoryResponse<Vec<ProjectForDisplay>> {
        query_as!(
            ProjectForDisplay,
            r#"
                select
                    projects.project_id,
                    projects.name,
                    projects.description,
                    projects.project_art,
                    projects.created_at,
                    projects.updated_at
                from projects
                where projects.is_deleted=false
                order by projects.updated_at desc
            "#,
        ).fetch_all(executor).await
    }

    pub async fn find_deleted_projects(
        executor: pg!(),
    ) -> RepositoryResponse<Vec<ProjectForDisplay>> {
        query_as!(
            ProjectForDisplay,
            r#"
                select
                    projects.project_id,
                    projects.name,
                    projects.description,
                    projects.project_art,
                    projects.created_at,
                    projects.updated_at
                from projects
                where projects.is_deleted=true
                order by projects.updated_at desc
            "#,
        ).fetch_all(executor).await
    }
}
