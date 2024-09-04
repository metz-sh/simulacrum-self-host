use std::time::Duration;

use axum::{body::Body, http::{HeaderValue, Method, Request, Response}, Router};
use tower_cookies::CookieManagerLayer;
use tower_http::{classify::ServerErrorsFailureClass, cors::AllowHeaders, trace::TraceLayer};
use tracing::Span;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tower_http::cors::CorsLayer;


use crate::{routes::{embed_routes, health_check_routes, project_routes, project_template_routes, RouterError}, AppState};

pub fn setup_router(app_state: AppState) -> Router<AppState> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                "rusty_backend=info,tower_http=debug,axum::rejection=trace".into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let tracing_layer = TraceLayer::new_for_http()
        .make_span_with(|_request: &Request<Body>| {
            tracing::info_span!(
                "http-request",
                path = tracing::field::Empty,
                method = tracing::field::Empty,
            )
        })
        .on_request(|request: &Request<Body>, span: &Span| {
            let path = request.uri().path();
            let method = request.method();
            span.record("path", path);
            span.record("method", method.to_string());
            tracing::info!(
                "request_received",
            )
        })
        .on_response(
            |response: &Response<Body>,
             latency: Duration,
             _span: &Span| {
                let error = response.extensions().get::<RouterError>();
                if let Some(error) = error  {
                    tracing::error!(
                        error=error.cause
                    );
                    return;
                }

                tracing::info!(
                    "response: {} {:?}",
                    response.status(),
                    latency,
                )
            },
        )
        .on_failure(
            |_traced_error: ServerErrorsFailureClass,
             _latency: Duration,
             _span: &Span| {
            },
        );

    Router::new()
        .merge(embed_routes())
        .merge(project_routes())
        .merge(project_template_routes())
        .layer(
            CorsLayer::new()
            .allow_credentials(true)
            .allow_origin(app_state.settings.frontend_origin.parse::<HeaderValue>().unwrap())
            .allow_headers(AllowHeaders::mirror_request())
            .allow_methods([
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::DELETE,
                Method::PATCH,
            ])
        )
        .layer(CookieManagerLayer::new())
        .merge(health_check_routes())
        .layer(tracing_layer)
}
