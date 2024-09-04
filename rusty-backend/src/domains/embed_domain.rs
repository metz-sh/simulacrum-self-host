use axum::http::StatusCode;
use serde::Serialize;
use strum_macros::AsRefStr;
use thiserror::Error;
use uuid::Uuid;

use crate::{repositories::{Embed, Project, RepositoryError, RepositoryResponse}, AppState};

use super::{project_domain::ProjectError, PublicError};

#[derive(Error, Debug, AsRefStr)]
pub enum EmbedError {
    #[error("Embed not found!")]
    NotFound,

    #[error("Something went wrong!")]
    ProjectDomainError(#[from] ProjectError),

    #[error("Something went wrong!")]
    DbError(#[from] RepositoryError)
}

#[derive(Serialize)]
pub struct CreateEmbedResponse {
    #[serde(serialize_with = "uuid::serde::simple::serialize")]
    pub embed_id: Uuid
}

#[derive(Serialize)]
pub struct EmbeddableProject {
    #[serde(serialize_with = "uuid::serde::simple::serialize")]
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub project_art: serde_json::Value,
    pub project_artifacts: serde_json::Value,
}

#[derive(Serialize)]
pub struct EmbeddableUser {
    pub name: Option<String>,
}

#[derive(Serialize)]
pub struct EmbeddedProject{
    pub project: EmbeddableProject,
}

pub struct EmbedDomain {}

impl EmbedDomain {
    pub async fn get_embed_id(
        project_uuid: Uuid,
        app_state: &AppState,
    ) -> Result<CreateEmbedResponse, EmbedError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db(), ).await?.ok_or(ProjectError::NotFound)?;
        let embed = get_or_init(project_id, app_state).await?;

        Ok(CreateEmbedResponse {
            embed_id: embed.embed_id,
        })
    }

    pub async fn get_embedded_project_for_embed_id(
        embed_id: Uuid,
        app_state: &AppState,
    ) -> Result<EmbeddedProject, EmbedError> {
        let rm = &app_state.repository_manager;
        let embed = Embed::find_by_embed_id(embed_id, rm.db()).await?.ok_or(EmbedError::NotFound)?;
        let project = Project::get_project_with_artifacts(embed.project_id, rm.db()).await?.ok_or(ProjectError::NotFound)?;

        Ok(
            EmbeddedProject {
                project: EmbeddableProject { project_id: project.project_id, name: project.name, description: project.description, project_art: project.project_art, project_artifacts: project.project_artifacts },
            }
        )
    }
}

async fn get_or_init(
    project_id: i32,
    app_state: &AppState,
) -> RepositoryResponse<Embed> {
    if let Some(embed) = Embed::find_by_project_id(project_id, app_state.repository_manager.db()).await? {
        Ok(embed)
    } else {
        Embed::create(project_id, app_state.repository_manager.db()).await
    }
}

impl PublicError for EmbedError {
    fn parse_error(&self) -> Option<super::ParsedPublicError> {
        match self {
            EmbedError::ProjectDomainError(error) => error.parse_error(),
            _ => {
                super::ParsedPublicError::new_option(
                    self.as_ref().to_string(),
                    self.to_string(),
                )
            }
        }
    }

    fn parse_status_code(&self) -> Option<StatusCode> {
        match self {
            EmbedError::NotFound => Some(StatusCode::NOT_FOUND),
            EmbedError::ProjectDomainError(error) => error.parse_status_code(),
            _ => None,
        }
    }
}
