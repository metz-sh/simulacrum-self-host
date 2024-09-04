use serde::Serialize;
use sqlx::{prelude::FromRow, query_as, types::JsonValue, PgExecutor};
use time::PrimitiveDateTime;

use super::{pg, RepositoryResponse};

#[derive(Serialize, FromRow, Debug)]
pub struct ProjectTemplate {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub created_at: PrimitiveDateTime,
    pub updated_at: PrimitiveDateTime,
    pub project_art: JsonValue,
    pub project_artifacts: JsonValue,
}

#[derive(Serialize, FromRow, Debug)]
pub struct ProjectTemplateWithoutArtifacts {
	pub id: i32,
    pub name: String,
    pub description: String,
    pub project_art: JsonValue,
}

impl ProjectTemplate {
	pub async fn get_templates(executor: pg!()) -> RepositoryResponse<Vec<ProjectTemplateWithoutArtifacts>> {
	    query_as!(
	        ProjectTemplateWithoutArtifacts,
	        r#"
	        select id, name, description, project_art from project_templates
	        "#
	    ).fetch_all(executor).await
	}

	pub async fn get_by_id(id: i32, executor: pg!()) -> RepositoryResponse<Option<ProjectTemplate>> {
	    query_as!(
	        ProjectTemplate,
	        r#"
	        select * from project_templates where id = $1
	        "#,
			id
	    ).fetch_optional(executor).await
	}
}
