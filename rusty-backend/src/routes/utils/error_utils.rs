use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;
use serde_json::{json, Value};

use crate::domains::PublicError;
use std::fmt::Debug;

//The actual error that will sent back as an http response
#[derive(Serialize, Debug, Clone)]
pub struct RouterError {
    #[serde(skip)]
    status_code: StatusCode,
    code: String,
    message: String,
    #[serde(skip)]
    pub cause: String,
}

impl RouterError {
    //This function translates errors returned by external domains
    fn parse_public_error(public_error: impl PublicError) -> RouterResult {
        let error = if let Some((status_code, parsed_public_error)) = public_error.parse_status_code().zip(public_error.parse_error()) {
            let (code, message) = parsed_public_error.get();
            RouterError::new(status_code, code.clone(), message.clone(), message.clone())
        } else {
            RouterError::internal_error(public_error)
        };
        Err(error)
    }

    pub(crate) fn new(
        status_code: StatusCode,
        code: String,
        message: String,
        cause: String,
    ) -> Self {
        Self {
            status_code,
            code,
            message,
            cause,
        }
    }

    pub(crate) fn internal_error(error: impl Debug) -> Self {
        RouterError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Unknown".into(),
            "Something went wrong!".into(),
            format!("{:?}", error),
        )
    }
}

impl IntoResponse for RouterError {
    fn into_response(self) -> axum::response::Response {
        let mut response = (self.status_code, Json(self.clone())).into_response();
        response.extensions_mut().insert(self);
        response
    }
}

pub struct RouterResponse {
    status_code: StatusCode,
    response: Json<Value>,
}

impl RouterResponse {
    fn new<O: Serialize>(
        status_code: StatusCode,
        output: O,
    ) -> RouterResult {
        Ok(Self {
            status_code,
            response: Json(json!(output)),
        })
    }
}

impl IntoResponse for RouterResponse {
    fn into_response(self) -> axum::response::Response {
        (self.status_code, self.response).into_response()
    }
}

pub type RouterResult = Result<RouterResponse, RouterError>;

//This is a helper trait which standardizes results returned by routes
pub(crate) trait Respond {
    fn respond(self, status_code: StatusCode) -> RouterResult;
}

impl<O: Serialize, E: PublicError> Respond for Result<O, E> {
    fn respond(self, status_code: StatusCode) -> RouterResult {
        match self {
            Ok(output) => RouterResponse::new(status_code, output),
            Err(error) => RouterError::parse_public_error(error),
        }
    }
}

//This is an escape hatch where routes don't return something they got from a domain
//but rather create the http response themselves, for example a redirect.
pub(crate) trait RespondPipe<O: IntoResponse> {
    fn respond(self) -> Result<O, RouterError>;
}

impl<O: IntoResponse> RespondPipe<O> for Result<O, anyhow::Error> {
    fn respond(self) -> Result<O, RouterError> {
        match self {
            Ok(output) => Ok(output),
            Err(error) => Err(RouterError::internal_error(error)),
        }
    }
}
