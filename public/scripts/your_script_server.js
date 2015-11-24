var data = [
	{id : 1, author : 'Peter', text : 'This is the first comment!'}
	, {id : 2, author : 'Jack', text : 'This is the *seconed* ~~comment!~~'}
];


var CommentForm = React.createClass({
	render : function(){
		return (
			<div className = "commentForm">
				<input type="text" placeHolder="Your Name"/>
				<input type="text" placeHolder="Say Something..."/>
				<input type="submit" value="post"/>
			</div>
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
				<CommentForm />
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