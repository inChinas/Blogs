import React, { PureComponent } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';


export default class Flow extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    }

    render() {
        return (
            <p> a</p>
        );
    }
}