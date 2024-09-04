use axum::http::StatusCode;
use serde::Deserialize;
use strum_macros::AsRefStr;
use thiserror::Error;
use uuid::Uuid;

use crate::{repositories::{project_repository::{ProjectForDisplay, ProjectWithArtifacts, ProjectWithoutArtifacts, SyncArtifacts, UpdateProjectUiFields, UpdatedServerSequence}, Project, RepositoryError }, AppState};

use super::PublicError;

#[derive(Error, Debug, AsRefStr)]
pub enum ProjectError {
    #[error("project not found!")]
    NotFound,

    #[error("Template not found!")]
    TemplateNotFound,

    #[error("You don't have access to this project!")]
    NotAuthorized,

    #[error("Could not sync project!")]
    SyncError,

    #[error("Can't be deleted permanently yet!")]
    NotReadyForDeletion,

    #[error("Something went wrong!")]
    DbError(#[from] RepositoryError),
}

#[derive(Deserialize)]
pub struct CreateProject {
    pub template_id: Option<i32>,
}

pub struct ProjectDomain {}

impl ProjectDomain {
    pub async fn get_without_artifacts(
        project_uuid: Uuid,
        app_state: &AppState,
    ) -> Result<ProjectWithoutArtifacts, ProjectError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db()).await?.ok_or(ProjectError::NotFound)?;
        Project::get_project_without_artifacts(project_id, app_state.repository_manager.db()).await?.ok_or(ProjectError::NotFound)
    }

    pub async fn get_with_artifacts(
        project_uuid: Uuid,
        app_state: &AppState,
    ) -> Result<ProjectWithArtifacts, ProjectError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db(), ).await?.ok_or(ProjectError::NotFound)?;

        Project::get_project_with_artifacts(project_id, app_state.repository_manager.db()).await?.ok_or(ProjectError::NotFound)
    }

    pub async fn create_project(
        params: CreateProject,
        app_state: &AppState,
    ) -> Result<ProjectWithoutArtifacts, ProjectError> {
        let db = app_state.repository_manager.db();
        let project = match params.template_id {
        	Some(template_id) => Project::create_project_from_template_id(template_id, db).await?.ok_or(ProjectError::TemplateNotFound)?,
         	None => Project::create_blank_project(db).await?
        };

        Ok(ProjectWithoutArtifacts { project_id: project.project_id, name: project.name, description: project.description, project_art: project.project_art })
    }

    pub async fn update_ui_fields(
        project_uuid: Uuid,
        params: UpdateProjectUiFields,
        app_state: &AppState,
    ) -> Result<ProjectWithoutArtifacts, ProjectError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db(), ).await?.ok_or(ProjectError::NotFound)?;
        Project::update_ui_fields(project_id, params, app_state.repository_manager.db()).await?.ok_or(ProjectError::NotFound)
    }

    pub async fn sync_artifacts(
        project_uuid: Uuid,
        params: SyncArtifacts,
        app_state: &AppState,
    ) -> Result<UpdatedServerSequence, ProjectError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db() ).await?.ok_or(ProjectError::NotFound)?;
        Project::sync_artifacts(project_id, params, app_state.repository_manager.db()).await?.ok_or(ProjectError::SyncError)
    }

    pub async fn find_viewable_projects(
        app_state: &AppState,
    ) -> Result<Vec<ProjectForDisplay>, ProjectError> {
        Ok(Project::find_viewable_projects(app_state.repository_manager.db()).await?)
    }

    pub async fn find_deleted_projects(
        app_state: &AppState,
    ) -> Result<Vec<ProjectForDisplay>, ProjectError> {
        Ok(Project::find_deleted_projects(app_state.repository_manager.db()).await?)
    }

    pub async fn soft_delete(
        project_uuid: Uuid,
        app_state: &AppState,
    ) -> Result<(), ProjectError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db() ).await?.ok_or(ProjectError::NotFound)?;
        Project::soft_delete(project_id, app_state.repository_manager.db()).await?;

        Ok(())
    }

    pub async fn restore_soft_deleted_project(
        project_uuid: Uuid,
        app_state: &AppState,
    ) -> Result<(), ProjectError> {
        let project_id = Project::get_id_from_project_uuid(project_uuid, app_state.repository_manager.db() ).await?.ok_or(ProjectError::NotFound)?;
        Project::restore_soft_deleted_project(project_id, app_state.repository_manager.db()).await?;

        Ok(())
    }
}

impl PublicError for ProjectError {
    fn parse_error(&self) -> Option<super::ParsedPublicError> {
        super::ParsedPublicError::new_option(
            self.as_ref().to_string(),
            self.to_string(),
        )
    }

    fn parse_status_code(&self) -> Option<StatusCode> {
        match self {
            ProjectError::NotFound => Some(StatusCode::NOT_FOUND),
            ProjectError::TemplateNotFound => Some(StatusCode::NOT_FOUND),
            ProjectError::NotAuthorized => Some(StatusCode::FORBIDDEN),
            ProjectError::SyncError => Some(StatusCode::BAD_REQUEST),
            _ => None,
        }
    }
}
