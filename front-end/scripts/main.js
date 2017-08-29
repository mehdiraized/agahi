import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import Modal from "react-modal";
import registerServiceWorker from "./registerServiceWorker";

var cookies = new Cookies();

var userReducer = function(state, action) {
  if (state === undefined) {
    state = [];
  }
  if (action.type === "ADD_USER") {
    state.push(action.user);
  }
  return state;
};
const store = createStore(userReducer);

const customStyles = {
  content: {
    //width                 : '300px',
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class App extends React.Component {
  componentWillMount() {
    store.dispatch({
      type: "ADD_USER",
      user: cookies.get("user") || ""
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      cats: [],
      username: "",
      password: ""
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  login() {
    axios
      .post(
        "http://localhost:8889/user/",
        {
          username: this.state.username,
          password: this.state.password
        },
        {
          contentType: "application/json; charset=utf-8"
        }
      )
      .then(res => {
        if (res.data.length == 0) {
          alert("نام کاربری و گذرواژه اشتباه است");
        } else {
          store.dispatch({
            type: "ADD_USER",
            user: {
              name: res.data[0].displayname,
              user: res.data[0].user,
              pass: res.data[0].pass,
              phone: res.data[0].phone,
              email: res.data[0].email,
              firstname: res.data[0].firstname,
              lastname: res.data[0].lastname
            }
          });
          cookies.set("user", res.data[0], { path: "/" });
          window.location.reload();
        }
      });
  }
  exit() {
    cookies.remove("user");
    window.location.reload();
  }
  componentDidMount() {
    axios.get(`http://localhost:8889/cats/`).then(res => {
      const cats = res.data.map(obj => obj);
      this.setState({ cats });
    });
  }
  render() {
    var user = store.getState()[0];
    var loginButton;
    if (user) {
      loginButton = (
        <div className="float-left">
          <button
            className="button inverted round outline float-left mr-10"
            onClick={this.exit}
          >
            خروج
          </button>
          <Link
            className="button inverted round outline float-left mt-5"
            to="/add"
          >
            افزودن اگهی
          </Link>
        </div>
      );
    } else {
      loginButton = (
        <button
          className="button inverted round outline float-left"
          onClick={this.openModal}
        >
          ورود
        </button>
      );
    }

    return (
      <header id="siteHeader">
        <div className="container">
          <h1 id="logo">سایت اگهی</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">صفحه اصلی</Link>
              </li>
              <li>
                <Link to="/contact">تماس با ما</Link>
              </li>
              <li>
                <Link to="/about">درباره ما</Link>
              </li>
              <li>
                <Link to="/">دسته بندی</Link>
                <ul>
                  {this.state.cats.map(cat =>
                    <li>
                      <Link target="_parent" to={"/category/" + cat.id + "/"}>
                        {cat.name}
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </nav>
          {loginButton}
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Login"
        >
          <span className="close big" onClick={this.closeModal} />
          <header>
            <h2>ورود</h2>
          </header>
          <form className="form">
            <div className="form-item">
              <label>ایمیل</label>
              <input
                placeholder="Email"
                type="email"
                onChange={event =>
                  this.setState({ username: event.target.value })}
              />
            </div>
            <div className="form-item">
              <label>گذرواژه</label>
              <input
                placeholder="Password"
                type="password"
                onChange={event =>
                  this.setState({ password: event.target.value })}
              />
            </div>
            <button
              className="button  outline inverted"
              type="button"
              onClick={this.login.bind(this)}
            >
              ورود
            </button>
          </form>
        </Modal>
      </header>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  init() {
    axios.get(`http://localhost:8889/posts/`).then(res => {
      const posts = res.data.map(obj => obj);
      this.setState({ posts });
    });
  }
  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/contact" component={contact} />
            <Route path="/About" component={About} />
            <Route path="/add" component={addpost} />
            <Route path="/edit/:id" component={editpost} />
            <Route path="/Post/:number" component={Post} />
            <Route path="/Category/:catid" component={category} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer id="siteFooter">
        <div className="container">
          <span>2016 khooger. Privacy Terms ©</span>
          <p>تمام حقوق این وبسایت برای خووگر محفوظ است </p>
        </div>
      </footer>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:8889/posts/`).then(res => {
      const posts = res.data.map(obj => obj);
      this.setState({ posts });
    });
  }
  removePost(id) {
    axios.delete(`http://localhost:8889/posts/${id}/`).then(res => {
      console.log(res);
    });
    $("#post" + id).fadeOut();
  }
  render() {
    return (
      <div className="container">
        <section id="posts">
          {this.state.posts.map(post =>
            <article className="post" id={"post" + post.id} key={post.id}>
              <figure>
                {post.pic != ""
                  ? <img src={post.pic} />
                  : <img src="assets/img/sample/post.jpg" />}
                {post.author_id == store.getState()[0].id
                  ? <span>
                      <a
                        type="button"
                        className="close float-left"
                        onClick={this.removePost.bind(this, post.id)}
                      />
                      <Link
                        type="button"
                        className="fa fa-pencil"
                        to={"/edit/" + post.id + "/"}
                      />
                    </span>
                  : ""}
              </figure>
              <header>
                <h3>
                  {post.title} <span>({post.category})</span>
                </h3>
              </header>
              <p>
                {post.content}
              </p>
              <footer>
                <span>
                  قیمت : {post.price} تومان
                </span>
                <a
                  href={"/post/" + post.id}
                  className="button secondary outline small float-left"
                >
                  ادامه مطلب
                </a>
              </footer>
            </article>
          )}
        </section>
      </div>
    );
  }
}

class contact extends React.Component {
  render() {
    return (
      <section className="container">
        <h1>تماس با ما</h1>
      </section>
    );
  }
}

class About extends React.Component {
  render() {
    return (
      <section className="container">
        <h1>درباره ما</h1>
      </section>
    );
  }
}

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: [],
      postid: props.match.params.number
    };
  }
  componentDidMount() {
    if (!this.state.postid) {
      return <div>متاسفانه موردی یافت نشد</div>;
    } else {
      axios
        .get("http://localhost:8889/posts/" + this.state.postid + "/")
        .then(res => {
          const post = res.data;
          this.setState({ post });
        });
    }
  }
  render() {
    return (
      <section className="single container">
        <article className="post" key={this.state.post.id}>
          <figure>
            {this.state.post.pic != ""
              ? <img src={this.state.post.pic} />
              : <img src="assets/img/sample/post.jpg" />}
          </figure>
          <header>
            <h3>
              {this.state.post.title}
            </h3>
          </header>
          <p>
            {this.state.post.content}{" "}
            <span className="button secondary outline small float-left">
              قیمت : {this.state.post.price} تومان
            </span>
          </p>
        </article>
      </section>
    );
  }
}

class addpost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cats: []
    };
    this.publish = this.publish.bind(this);
  }
  componentWillMount() {
    axios.get(`http://localhost:8889/cats/`).then(res => {
      const cats = res.data.map(obj => obj);
      this.setState({ cats });
    });
  }
  publish() {
    event.preventDefault();

    var formData = new FormData();
    formData.append("title", this.refs.title.value);
    formData.append("catid", this.refs.catid.value);
    formData.append("content", this.refs.content.value);
    formData.append("pic", this.refs.file.files[0]);
    formData.append("price", this.refs.price.value);
    formData.append("author_id", store.getState()[0].id);

    axios({
      method: "post",
      url: "http://localhost:8889/posts/",
      data: formData
    }).then(
      res => {
        console.log(res);
        if (res.data.length == 0) {
          alert("نام کاربری و گذرواژه اشتباه است");
        } else {
          alert("ثبت شد");
        }
      },
      res => {
        console.log(res);
      }
    );
  }
  render() {
    return (
      <section className="single container">
        <form className="form">
          <div className="row gutters auto">
            <div className="form-item col">
              <label>عنوان</label>
              <input type="text" ref="title" />
            </div>

            <div className="form-item col">
              <label>دسته بندی</label>
              <label className="lbselect">
                <select ref="catid">
                  {this.state.cats.map(cat =>
                    <option value={cat.id}>
                      {cat.name}
                    </option>
                  )}
                </select>
              </label>
            </div>
          </div>
          <div className="form-item ">
            <textarea ref="content" rows="6" />
          </div>
          <div className="row auto">
            <div className="form-item col">
              <label>تصویر</label>
              <input type="file" ref="file" accept="image/*" />
            </div>
            <div className="form-item float-left">
              <label>قیمت</label>
              <div className="prepend">
                <input type="text" ref="price" className="w20" />
                <span>تومان</span>
              </div>
            </div>
          </div>
          <div className="form-item">
            <button className="float-left" type="button" onClick={this.publish}>
              ثبت آگهی
            </button>
            <button className="button secondary outline" type="button">
              ذخیره
            </button>
          </div>
        </form>
      </section>
    );
  }
}

class editpost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: [],
      cats: [],
      title: "",
      postid: props.match.params.id
    };
    this.publish = this.publish.bind(this);
  }
  componentWillMount() {
    axios.get(`http://localhost:8889/posts/${this.state.postid}/`).then(res => {
      const post = res.data;
      this.setState({ post });
      this.setState({ title: res.data.title });
    });
    axios.get(`http://localhost:8889/cats/`).then(res => {
      const cats = res.data.map(obj => obj);
      this.setState({ cats });
    });
  }
  publish() {
    event.preventDefault();

    var formData = new FormData();
    formData.append("title", this.refs.title.value);
    formData.append("catid", this.refs.catid.value);
    formData.append("content", this.refs.content.value);
    formData.append("pic", this.refs.file.files[0]);
    formData.append("price", this.refs.price.value);
    formData.append("author_id", store.getState()[0].id);

    axios({
      method: "POST",
      url: `http://localhost:8889/posts/${this.state.postid}/`,
      data: formData
    }).then(
      res => {
        console.log(res);
        if (res.data.length == 0) {
          alert("نام کاربری و گذرواژه اشتباه است");
        } else {
          alert("ویرایش شد");
        }
      },
      res => {
        console.log(res);
      }
    );
  }
  handleChange(e, type) {
    const post = this.state.post;
    if (type == "title") {
      post.title = e.target.value;
    } else if (type == "catid") {
      post.catid = e.target.value;
    } else if (type == "content") {
      post.content = e.target.value;
    } else if (type == "price") {
      post.price = e.target.value;
    }
    this.setState({ post });
  }
  render() {
    return (
      <section className="single container">
        <form className="form">
          <div className="row gutters auto">
            <div className="form-item col">
              <label>عنوان</label>
              <input
                type="text"
                ref="title"
                value={this.state.post.title}
                onChange={this.handleChange.bind(this, event, "title")}
              />
            </div>

            <div className="form-item col">
              <label>دسته بندی</label>
              <label className="lbselect">
                <select
                  ref="catid"
                  value={this.state.post.catid}
                  onChange={this.handleChange.bind(this, "catid")}
                >
                  {this.state.cats.map(cat =>
                    <option value={cat.id}>
                      {cat.name}
                    </option>
                  )}
                </select>
              </label>
            </div>
          </div>
          <div className="form-item ">
            <textarea
              ref="content"
              value={this.state.post.content}
              onChange={this.handleChange.bind(this, event, "content")}
              rows="6"
            />
          </div>
          <div className="row auto">
            <div className="form-item col">
              <label>تصویر</label>
              <input type="file" ref="file" accept="image/*" />
            </div>
            <div className="form-item float-left">
              <label>قیمت</label>
              <div className="prepend">
                <input
                  type="text"
                  ref="price"
                  className="w20"
                  value={this.state.post.price}
                  onChange={this.handleChange.bind(this, event, "price")}
                />
                <span>تومان</span>
              </div>
            </div>
          </div>
          <div className="form-item">
            <button className="float-left" type="button" onClick={this.publish}>
              ویرایش آگهی
            </button>
            <button className="button secondary outline" type="button">
              ذخیره
            </button>
          </div>
        </form>
      </section>
    );
  }
}

class category extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      catid: props.match.params.catid
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:8889/category/${this.state.catid}/`)
      .then(res => {
        const posts = res.data.map(obj => obj);
        console.log(posts);
        this.setState({ posts });
      });
  }
  removePost(id) {
    axios.delete(`http://localhost:8889/posts/${id}/`).then(res => {
      console.log(res);
    });
    $("#post" + id).fadeOut();
  }
  render() {
    return (
      <div className="container">
        <section id="posts">
          {this.state.posts.map(post =>
            <article className="post" id={"post" + post.id} key={post.id}>
              <figure>
                {post.pic != ""
                  ? <img src={post.pic} />
                  : <img src="assets/img/sample/post.jpg" />}
                {post.author_id == store.getState()[0].id
                  ? <span>
                      <a
                        type="button"
                        className="close float-left"
                        onClick={this.removePost.bind(this, post.id)}
                      />
                      <Link
                        type="button"
                        className="fa fa-pencil"
                        to={"/edit/" + post.id + "/"}
                      />
                    </span>
                  : ""}
              </figure>
              <header>
                <h3>
                  {post.title} <span>({post.category})</span>
                </h3>
              </header>
              <p>
                {post.content}
              </p>
              <footer>
                <span>
                  قیمت : {post.price} تومان
                </span>
                <a
                  href={"/post/" + post.id}
                  className="button secondary outline small float-left"
                >
                  ادامه مطلب
                </a>
              </footer>
            </article>
          )}
        </section>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("app")
);

registerServiceWorker();
