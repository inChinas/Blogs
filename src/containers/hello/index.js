import React, { Component, createFactory } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';


import styles from './hello.less';

class   hello extends Component {
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            // <img src='images/homepage.png' />'
            <div>
                <p className={styles.title}>HelloWorld</p>
            </div>
        );
    }
}

export default hello;