use axum::{
    extract::{ State, Path },
    http::StatusCode,
    routing::get,
    Router,
};

use crate::{
    domains::ProjectTemplateDomain, AppState
};

use super::utils::{
    error_utils::{Respond, RouterResult}, validation_utils::{validated_path, ValidatedPath}, versioned_utils::{Routers, VersionedRouter}
};

async fn get_templates(
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectTemplateDomain::get_templates(
        &app_state,
    )
    .await
    .respond(StatusCode::OK)
}

async fn find_project_template_by_id(
	validated_path!(template_id): ValidatedPath<i32>,
    State(app_state): State<AppState>,
) -> RouterResult {
    ProjectTemplateDomain::get_by_id(
    	template_id,
        &app_state,
    )
    .await
    .respond(StatusCode::OK)
}

pub fn project_template_routes() -> Router<AppState> {
    let router = Router::new()
    .route("/", get(get_templates))
    .route("/:template_id", get(find_project_template_by_id));

    Routers::V1
    .nest(
        Router::new().nest("/project_templates", router)
    )
}
