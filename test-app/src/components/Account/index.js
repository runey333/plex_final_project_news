import React from 'react';

import { AuthUserContext } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { withAuthorization } from '../Session';
import { useState, useEffect } from 'react';

import { withFirebase } from '../Firebase';
import './index.css';

function AccountPage(props) {
	const [userSearchList, setUserSearchList] = useState([]);
	const [userReadList, setUserReadList] = useState([]);

	var currUser = props.firebase.auth.currentUser;
	var currUserId = currUser.uid;
	var userRef = props.firebase.db.ref("users/" + currUserId);
	var userListRef = props.firebase.db.ref("users/" + currUserId + "/searchList");
	var userReadListRef = props.firebase.db.ref("users/" + currUserId + "/readList");

	const getList = (listRef, stateFunc, stateVar) => {
		var temp = [];
		var query = listRef.orderByKey();
		query.once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
      		var key = childSnapshot.key;
      		var childData = childSnapshot.val();
				if (childData != "dummy") {
					//temp.push(childData);
					temp = stateVar;
					temp.push(childData);
					stateFunc([...temp]);
				}
  			});
		});
		console.log(temp);
		console.log(userSearchList.length);
	}

	useEffect(() => getList(userListRef, setUserSearchList, userSearchList), []);
	useEffect(() => getList(userReadListRef, setUserReadList, userReadList), []);

	const searchListItems = userSearchList.map((number) =>
  		<li>{number}</li>
	);

	const readListItems = userReadList.map((number) =>
  		<li><a href={number}>{number}</a></li>
	);

	const deleteAccount = () => {
		currUser.delete().then(function() {
  			// User deleted.
		}).catch(function(error) {
  			// An error happened.
		});

		userRef.remove().then(function() {
    		
  		}).catch(function(error) {
    		
  		});
		
		props.firebase.doSignOut();
	}

	return (
  		<div id="accountDiv">
			<AuthUserContext.Consumer>
    		{authUser => (
      		<div>
        			<h1>Account: {authUser.email}</h1>
					<h3>Reset Password</h3>
        			<PasswordForgetForm />
        			<PasswordChangeForm />
      		</div>
    		)}
  			</AuthUserContext.Consumer>
			<div id="history">
				<div id="search">
  					<h3> Search History </h3>
  					<ul>{searchListItems}</ul>
				</div>
				<div id="read">
					<h3> Reading History </h3>
					<ul>{readListItems}</ul>
				</div>
			</div>
			<div>
				<input type="button" value="Delete Account" onClick={deleteAccount}/>
			</div>
  		</div>
	);
}

const authCondition = authUser => !!authUser;

export default withFirebase(withAuthorization(authCondition)(AccountPage));
