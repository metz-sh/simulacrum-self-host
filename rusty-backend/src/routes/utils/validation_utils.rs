use super::error_utils::RouterError;
use axum::extract::rejection::{JsonRejection, PathRejection};
use axum::extract::Path;
use axum::extract::Json;
use axum::extract::{rejection::QueryRejection, Query};
use axum::http::StatusCode;
use axum_extra::extract::WithRejection;

pub(crate) type ValidatedQuery<T> = WithRejection<Query<T>, RouterError>;
impl From<QueryRejection> for RouterError {
    fn from(rejection: QueryRejection) -> RouterError {
        RouterError::new(
            StatusCode::BAD_REQUEST,
            "BadRequest".into(),
            rejection.body_text(),
            rejection.to_string(),
        )
    }
}

macro_rules! validated_query {
    ($param: ident) => {
        axum_extra::extract::WithRejection(Query($param), _)
    };
}
pub(crate) use validated_query;

pub(crate) type ValidatedPath<T> = WithRejection<Path<T>, RouterError>;
impl From<PathRejection> for RouterError {
    fn from(rejection: PathRejection) -> RouterError {
        RouterError::new(
            StatusCode::BAD_REQUEST,
            "BadRequest".into(),
            rejection.body_text(),
            rejection.to_string(),
        )
    }
}

macro_rules! validated_path {
    ($param: ident) => {
        axum_extra::extract::WithRejection(Path($param), _)
    };
}
pub(crate) use validated_path;

pub(crate) type ValidatedJson<T> = WithRejection<Json<T>, RouterError>;
impl From<JsonRejection> for RouterError {
    fn from(rejection: JsonRejection) -> RouterError {
        RouterError::new(
            StatusCode::BAD_REQUEST,
            "BadRequest".into(),
            rejection.body_text(),
            rejection.to_string(),
        )
    }
}

macro_rules! validated_json {
    ($param: ident) => {
        axum_extra::extract::WithRejection(Json($param), _)
    };
}
pub(crate) use validated_json;