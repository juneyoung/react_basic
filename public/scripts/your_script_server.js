/**
 * React 에서는 각 컴포넌트는 초기화 시점 뿐 아니라 항상 뷰의 상태를 표현할 수 있어야 한다.
 * React, components should always represent the state of the view and not only at the point of initialization.
 *
 */

var data = [
	{id : 1, author : 'Peter', text : 'This is the first comment!'}
	, {id : 2, author : 'Jack', text : 'This is the *seconed* ~~comment!~~'}
];


var CommentForm = React.createClass({
	getInitialState : function(){
		return {author : '', text : ''};
	}
	, handleAuthorChange : function(e) {
		this.setState({author : e.target.value});
	}
	, handleTextChange : function(e) {
		this.setState({text : e.target.value});
	}
	, handleSubmit : function(e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if(!text || !author) {
			return;
		}

		this.props.onCommentSubmit({author : author, text : text});
		this.setState({author : '', text : ''});
	}
	, render : function(){
		return (
			<form className = "commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeHolder="Your Name" value={this.state.author} onChange={this.handleAuthorChange}/>
				<input type="text" placeHolder="Say Something..." value={this.state.text} onChange={this.handleTextChange}/>
				<input type="submit" value="post"/>
			</form>
		);
	}
});


var Comment = React.createClass({
	rawMarkup : function(){
		var rawMarkup = marked(this.props.children.toString(), {sanitize : true});
		return {
			__html : rawMarkup
		};
	}
	, render : function(){
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				{/*
					아래방식으로는 XSS 방어로 문자열이 이스케이프 문자열로 변환이 됨.
					-> rawMarkup 추가 
					{marked(this.props.children.toString())}
				*/}
				<span dangerouslySetInnerHTML = {this.rawMarkup()} />
			</div>
		);
	}
});




var CommentBox = React.createClass({
	loadCommentsFromServer : function(){
		$.ajax({
			url : this.props.url
			, dataType : 'json'
			, cache : false
			, success : function(data){
				this.setState({data : data});
			}.bind(this)
			, error : function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}
	, handleCommentSubmit : function (comment){

		var comments = this.state.data;
		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data : newComments});

		$.ajax({
			url : this.props.url
			, dataType : 'json'
			, type: 'POST'
			, data : comment
			, success : function(data) {
				this.setState({data : data});
			}.bind(this)
			, error : function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}
	//this.setState() 가 불리면 갱신 
	, getInitialState : function(){
		return {data : []};
	}
	, componentDidMount : function (){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	}
	//컴포넌트가 렌더될 때, React 에 의해 자동적으로 호출되는 메소드 
	, render : function(){
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
			</div>
		);
	}
});


var CommentList = React.createClass({
	
	render : function(){
		var commentNodes = this.props.data.map(function(comment){
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});

		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});


ReactDOM.render(
	<CommentBox url='/api/comments' pollInterval={2000}/>
	, document.getElementById('content')
);