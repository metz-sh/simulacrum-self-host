use axum::Router;

pub(crate) trait VersionedRouter {
    fn nest<State: Clone + Send + Sync + 'static>(
        &self,
        router: Router<State>,
    ) -> Router<State>;
}
pub(crate) enum Routers {
    V1,
}

impl VersionedRouter for Routers {
    fn nest<State: Clone + Send + Sync + 'static>(
        &self,
        router: Router<State>,
    ) -> Router<State> {
        match self {
            Routers::V1 => Router::new().nest("/v1", router),
        }
    }
}
