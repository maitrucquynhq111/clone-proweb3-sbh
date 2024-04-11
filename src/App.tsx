import { useRoutes } from 'react-router-dom';
import { routes } from '~app/routes';
import './styles/finan-custom.less';
import './i18n';
import './styles/global.css';

const App = () => useRoutes(routes);

export default App;
