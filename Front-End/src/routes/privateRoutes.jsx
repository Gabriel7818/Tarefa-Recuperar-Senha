import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from '../components/Login/Login';
import { RecoveryPassword } from '../page/recoveryPassword/recoveryPassword';
import { updatePassword } from '../page/updatePassword/updatePassword';
import { Context } from '../context/AuthContext';

function CustomRoute({ isPrivate, ...rest}){
    const { authenticated } = useContext(Context);
    if (isPrivate && !authenticated){
        return <Redirect to="/"  />
    }
    return <Route { ...rest } />
};

export default function PrivateRoute(){
    return (
        <Switch>
            <CustomRoute exact path="/" component={Login} />
            <CustomRoute path="/recoverypassword" component={RecoveryPassword} />
            <CustomRoute path="/updatepassword" component={updatePassword} />
        </Switch>
    );
};