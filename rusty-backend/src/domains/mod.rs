use std::fmt::Debug;

use axum::http::StatusCode;

pub mod project_domain;
pub mod embed_domain;
pub mod project_template_domain;

pub use project_domain::ProjectDomain;
pub use embed_domain::EmbedDomain;
pub use project_template_domain::ProjectTemplateDomain;

//Domains can be internal or external, such that internal ones help other domains and external ones help the client.
//This is the interface external domains use to return errors to clients.
pub struct ParsedPublicError {
    code: String,
    message: String,
}
impl ParsedPublicError {
    pub fn get(&self) -> (&String, &String) {
        (&self.code, &self.message)
    }

    pub fn new_option(code: String, message: String) -> Option<ParsedPublicError> {
        Some(Self {
            code,
            message,
        })
    }
}

//This is a helper trait external domains implement to return errors.
//The methods in this trait help to abstract over internal error setup which could be an enum or a struct.
pub trait PublicError: Debug {
    //Enable external domains to send custom http status codes, if not provided default one will be used
    fn parse_status_code(&self) -> Option<StatusCode>;
    //Same as parse_status_code
    fn parse_error(&self) -> Option<ParsedPublicError>;
}

//We implement PublicError for anyhow as an escape hatch. In case an external domain
//didn't want to implement PublicError and wanted to go with the defaults
impl PublicError for anyhow::Error {
    fn parse_status_code(&self) -> Option<StatusCode> {
        Some(StatusCode::INTERNAL_SERVER_ERROR)
    }

    fn parse_error(&self) -> Option<ParsedPublicError> {
        None
    }
}
