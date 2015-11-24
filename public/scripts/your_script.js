/**
 * v1
 */
/*
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
*/


/**
 * v2
 */
/*
var CommentBox = React.createClass({
	displayName : "CommentBox"
	, render : function(){
		return (React.createElement('div', {
			className : 'commentBox'
		}, "Hello, I'm in the CommentBox!"));
	}	
});
*/





/**
 * v3
 */

/*
var CommentList = React.createClass({
	render : function(){
		return (
			<div className='commentList'>
			This is CommentList!
			</div>
		);
	}
});
*/

var CommentForm = React.createClass({
	render : function(){
		return (
			<div className = "commentForm">
			This is CommentForm!
			</div>
		);
	}
});


/* Go to v5
var CommentBox = React.createClass({
	render : function(){
		return (
			<div className = "commentBox">
				<h1>Comments</h1>
				<CommentList/>
				<CommentForm/>
			</div>
		);
	}	
});
*/


/**
 * v4
 */

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

/* Go to v5
var CommentList = React.createClass({
	render : function(){
		return (
			<div className = 'commentList'>
				<Comment author='Dick'> I'm Dick! </Comment>
				<Comment author='Tess'> I'm *another*! </Comment> 
			</div>
		);
	}
});
*/

/**
 * v5 - data setting
 */

var data = [
	{id : 1, author : 'Peter', text : 'This is the first comment!'}
	, {id : 2, author : 'Jack', text : 'This is the *seconed* ~~comment!~~'}
];


var CommentBox = React.createClass({
	render : function(){
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.props.data} />
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


/* Go to v5
ReactDOM.render(
	React.createElement(CommentBox, null)
	, document.getElementById('content')
);
*/


ReactDOM.render(
	<CommentBox data={data}/>
	, document.getElementById('content')
);