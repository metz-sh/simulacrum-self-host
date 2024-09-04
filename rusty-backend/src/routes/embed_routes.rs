use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    routing::get,
    Router,
};
use serde::Deserialize;

use uuid::Uuid;

use super::utils::{
    error_utils::{Respond, RouterResult}, validation_utils::{validated_path, validated_query, ValidatedPath, ValidatedQuery}, versioned_utils::VersionedRouter
};
use crate::{
    domains::EmbedDomain, AppState
};

#[derive(Deserialize)]
pub struct GetEmbedId {
    project_uuid: Uuid,
}

pub async fn get_embed_id(
    validated_query!(params): ValidatedQuery<GetEmbedId>,
    State(app_state): State<AppState>,
) -> RouterResult {
    EmbedDomain::get_embed_id(params.project_uuid, &app_state)
    .await
    .respond(StatusCode::OK)
}

pub async fn get_embedded_project(
    validated_path!(embed_id): ValidatedPath<Uuid>,
    State(app_state): State<AppState>,
) -> RouterResult {
    EmbedDomain::get_embedded_project_for_embed_id(embed_id, &app_state)
    .await
    .respond(StatusCode::OK)
}

pub fn embed_routes() -> Router<AppState> {
    let router = Router::new()
        .route("/:embed_id", get(get_embedded_project))
        .route("/", get(get_embed_id));

    super::utils::versioned_utils::Routers::V1
        .nest(Router::new().nest("/embeds", router))
}
