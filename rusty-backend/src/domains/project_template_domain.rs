use axum::http::StatusCode;
use strum_macros::AsRefStr;
use thiserror::Error;

use crate::{repositories::{project_template_repository::ProjectTemplateWithoutArtifacts, ProjectTemplate, RepositoryError }, AppState};

use super::PublicError;

#[derive(Error, Debug, AsRefStr)]
pub enum ProjectTemplateError {
    #[error("template not found!")]
    NotFound,

    #[error("Something went wrong!")]
    DbError(#[from] RepositoryError),
}

pub struct ProjectTemplateDomain {}

impl ProjectTemplateDomain {
	pub async fn get_templates(
        app_state: &AppState,
    ) -> Result<Vec<ProjectTemplateWithoutArtifacts>, ProjectTemplateError> {
        Ok(ProjectTemplate::get_templates(app_state.repository_manager.db()).await?)
    }

    pub async fn get_by_id(
	   id: i32,
        app_state: &AppState,
    ) -> Result<ProjectTemplate, ProjectTemplateError> {
        ProjectTemplate::get_by_id(id, app_state.repository_manager.db()).await?.ok_or(ProjectTemplateError::NotFound)
    }
}

impl PublicError for ProjectTemplateError {
    fn parse_error(&self) -> Option<super::ParsedPublicError> {
        super::ParsedPublicError::new_option(
            self.as_ref().to_string(),
            self.to_string(),
        )
    }

    fn parse_status_code(&self) -> Option<StatusCode> {
        match self {
            ProjectTemplateError::NotFound => Some(StatusCode::NOT_FOUND),
            _ => None,
        }
    }
}
