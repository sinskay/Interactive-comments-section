import './sass/index.scss'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import DisplayAllComments from './compenents/DisplayAllComments'
import AddComment from './compenents/AddComment'






function App() {

  return (
    <>
      <DisplayAllComments/>
      <AddComment actionName={"submitComment"}/>
    </>
  )
}

export default App
