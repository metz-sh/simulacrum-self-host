use axum::{
    extract::{Json, Path, State},
    http::StatusCode,
    routing::{delete, get, patch, post},
    Router,
};
use uuid::Uuid;

use crate::{
    domains::{project_domain::CreateProject, ProjectDomain}, repositories::project_repository::{SyncArtifacts, UpdateProjectUiFields}, AppState
};

use super::utils::{
    error_utils::{Respond, RouterResult},
    validation_utils::{validated_json, validated_path, ValidatedJson, ValidatedPath},
    versioned_utils::{Routers, VersionedRouter},
};

async fn find_project_by_id(
    validated_path!(project_uuid): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectDomain::get_without_artifacts(
        project_uuid,
        &app_state,
    )
    .await
    .respond(StatusCode::OK)
}

async fn find_project_artifacts_by_id(
    validated_path!(project_uuid): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectDomain::get_with_artifacts(
        project_uuid,
        &app_state,
    )
    .await
    .respond(StatusCode::OK)
}

async fn sync_project_artifacts_by_id(
    validated_path!(project_uuid): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
    validated_json!(params): ValidatedJson<SyncArtifacts>
) -> RouterResult {
    ProjectDomain::sync_artifacts(
        project_uuid,
        params,
        &app_state,
    )
    .await
    .respond(StatusCode::OK)
}

async fn create_project(
    State(app_state): State<AppState>,
	validated_json!(params): ValidatedJson<CreateProject>,
) -> RouterResult {
	ProjectDomain::create_project(
        params,
        &app_state,
    )
	.await
	.respond(StatusCode::OK)
}

async fn update_project_ui_fields(
    validated_path!(project_uuid): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
    validated_json!(params): ValidatedJson<UpdateProjectUiFields>,
) -> RouterResult {
    ProjectDomain::update_ui_fields(
        project_uuid,
        params,
        &app_state,
    )
    .await
    .respond(StatusCode::OK)
}

async fn find_viewable_projects(
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectDomain::find_viewable_projects(&app_state).await.respond(StatusCode::OK)
}

async fn find_deleted_projects(
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectDomain::find_deleted_projects(&app_state).await.respond(StatusCode::OK)
}

async fn soft_delete(
    validated_path!(project_uuid): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectDomain::soft_delete(project_uuid, &app_state).await.respond(StatusCode::OK)
}

async fn restore_soft_deleted_project(
    validated_path!(project_uuid): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectDomain::restore_soft_deleted_project(project_uuid, &app_state).await.respond(StatusCode::OK)
}

pub fn project_routes() -> Router<AppState> {
    let router = Router::new()
    .route("/", post(create_project))
    .route("/", get(find_viewable_projects))
    .route("/:project_uuid", get(find_project_by_id))
    .route("/:project_uuid", patch(update_project_ui_fields))
    .route("/:project_uuid/artifacts", get(find_project_artifacts_by_id))
    .route("/:project_uuid/artifacts", patch(sync_project_artifacts_by_id))
    .route("/:project_uuid", delete(soft_delete))
    .route("/deleted", get(find_deleted_projects))
    .route("/deleted/:project_uuid", patch(restore_soft_deleted_project));

    Routers::V1
    .nest(
        Router::new().nest("/projects", router)
    )
}
