import { Switch, Route, Router as WouterRouter } from 'wouter';
import CrosswordPage from '@/pages/CrosswordPage';

function Router() {
  return (
    <Switch>
      <Route path="/" component={CrosswordPage} />
      <Route path="*" component={CrosswordPage} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
