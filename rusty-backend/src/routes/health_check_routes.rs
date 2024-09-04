use axum::{
    http::StatusCode,
    routing::get,
    Router,
};




use super::RouterError;
use crate::AppState;


pub async fn health_check(
) -> Result<StatusCode, RouterError> {
    Ok(StatusCode::OK)
}

pub fn health_check_routes() -> Router<AppState> {
    Router::new()
        .route("/health", get(health_check))
}
