#[derive(Debug, Clone)]
pub struct WorkosUrls {
    pub authorization_url_api: String,
    pub authenticate_with_code_api: String,
}
impl Default for WorkosUrls {
    fn default() -> Self {
        Self { 
            authorization_url_api: "/user_management/authorize".to_string(), 
            authenticate_with_code_api: "/user_management/authenticate".to_string(), 
        }
    }
}

#[derive(Debug, Clone)]
pub struct UrlDomain {
    pub workos_urls: WorkosUrls,
}

impl Default for UrlDomain {
    fn default() -> Self {
        Self::new()
    }
}

impl UrlDomain {
    pub fn new() -> Self {
        Self { workos_urls: WorkosUrls::default() }
    }
}