import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle,setCurrentArticle] = useState(null)

  
 


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    navigate('/')
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().post('http://localhost:9000/api/login',{
      username,
      password
    })
    .then(res => {
      localStorage.setItem('token', res.data.token)
      setSpinnerOn(false)
      setMessage(`Here are your articles, ${username}!`);
      navigate('/articles')
      getArticles()
      console.log(res,'login')
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false)
    })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    axiosWithAuth().get('http://localhost:9000/api/articles')
  .then(res =>{
    setArticles(res.data.articles)
  })
  .catch(err => {
    console.log(err,'get articles error')
    setSpinnerOn(false)
  })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    axiosWithAuth().post('http://localhost:9000/api/articles',article)
    .then(res => {
      const newArticle = res.data.article;
      setArticles([...articles, newArticle])
      setMessage (res.data.message)
      setCurrentArticleId(res.data.article.article_id) 
    })
    .catch(res => {
      console.log(res,'error posting')
      setMessage('error posting')
    })
    
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    axiosWithAuth()
    .put(`http://localhost:9000/api/articles/${article_id}`,article)
    .then (res => {
      console.log(res,'updated article response')
      const updatedArticle = res.data.article
      const updatedArticles = articles.map((art) =>
        art.article_id === article_id ? updatedArticle : art
      );
      setArticles(updatedArticles)
      setMessage(res.data.message)
    })
    .catch(( err) => {
      console.log(err)
      setMessage('error updating')
    })
    // ✨ implement
    // You got this!
  }


  const deleteArticle = article_id => {
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
    .then(res => {
      setArticles(articles.filter(article => article.article_id !== article_id));
      setMessage(res.data.message)
    })
    .catch(res => {
      console.log(res)
    })
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle}  updateArticle={updateArticle} currentArticleId={currentArticleId}  setCurrentArticleId={setCurrentArticleId} articles={articles} setArticles={setArticles} currentArticle={currentArticle} setCurrentArticle={setCurrentArticle} />
              <Articles articles={articles} setArticles={setArticles} deleteArticle={deleteArticle} currentArticleId={currentArticleId} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId}  currentArticle={currentArticle} setCurrentArticle={setCurrentArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
