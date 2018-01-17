import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';


import Flow from './components/waterfallFlow';


ReactDOM.render(
    <AppContainer>
        <Flow />
    </AppContainer>,
    document.getElementById('root'),
);

// 模块热替换的 API
if (module.hot) {
    module.hot.accept();
}
