import React from 'react';
import MovieList from './MovieList';
import SearchBar from './SearchBar';
import AddMovie from './AddMovie';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
  import EditMovie from './EditMovie';




class App extends React.Component {

    state = {
        movies : [],
        
        searchQuery: ""


    }
    /*json dosyası ile aldığımız verileri sayfamıza dahil ettik."compnentdidmount ile" */
 /*
                  (fetch() İle veri çekme) 
    async componentDidMount(){
        const baseURL= "http://localhost:3002/movies";
        const response = await fetch(baseURL);
        const data = await response.json();
        this.setState({movies: data})  
    }  */

    // axios kütüphanesi ile veri çekme

    componentDidMount(){
       this.getMovies();
    }
    async getMovies(){
        const response = await axios.get("http://localhost:3002/movies");
        this.setState({movies: response.data})
    }

    /* Delete butonunu aktif edip içindeki componenti silme çalışması */
 /*   deleteMovie = (movie) =>{
        const newMovieList = this.state.movies.filter(
            m => m.id !== movie.id
        );
        this.setState(state =>({
            movies:newMovieList
        }))
    }    */
    
    //FETCH APİ ile delete oluşturma

/*    deleteMovie = async (movie) =>{
        
        const baseURL = `http://localhost:3002/movies/${movie.id}`
        await fetch(baseURL,{
            method: "DELETE"
        })

        const newMovieList = this.state.movies.filter(
            m => m.id !== movie.id
        );
        this.setState(state =>({
            movies:newMovieList
        }))
    }  */

    //AXİOS methodu ile delete işlemi

    deleteMovie = async (movie) =>{
        
        axios.delete(`http://localhost:3002/movies/${movie.id}`)
        const newMovieList = this.state.movies.filter(
            m => m.id !== movie.id
        );
        this.setState(state =>({
            movies:newMovieList
        }))
    }


    /* Arama kutusunda yazılanlara göre sayfayı güncelleme işlemi */
    searchMovie = (event) =>{
        this.setState({searchQuery: event.target.value})
    }


    /* ADD movie Sayfaya ekleme yapma işlemi*/

    addMovie = async (movie) => {
        await axios.post(`http://localhost:3002/movies/`,movie)
        this.setState(state =>({
            movies:state.movies.concat([movie])
        }))
        this.getMovies();

    }
    /* EDİT movie Sayfaya güncelleme yapma işlemi*/

    editMovie = async (id, updatedMovie) => {
        await axios.put(`http://localhost:3002/movies/${id}`,updatedMovie)
        this.getMovies();

    }

    render() {
        /* Arama yapılması durumunda oluşabilecek büyük harf küçük harf olayına göre sayfayı küçük harf gibi alma*/
        let filteredMovies = this.state.movies.filter(
            (movie) =>{
                return movie.name.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1
            }
        ).sort( (a,b) =>{
            return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;    /* Burada yapılan yapı gelen verileri idlerine göre sıralama işlemidir.id büyük olanı en önde yazdırır. */
        });

      return (
        <Router>
            <div className="container">
                <Switch>
                

                    <Route path="/"exact render={() =>(
                        <React.Fragment>
                            <div className="row">
                                <div className="col-lg-12">
                                    <SearchBar searchMovieProp={this.searchMovie} />
                                </div>
                            </div>
                            <MovieList
                                movies={filteredMovies}
                                deleteMovieProp={this.deleteMovie} />
                        </React.Fragment>               
                    )}>
    
                    </Route>
                    
                    <Route path="/add" render={({history}) =>(
                        <AddMovie 
                        onAddMovie={(movie) => {this.addMovie(movie)
                            history.push("/")
                        }
                    }

                        />
                    )}>
    
                    </Route>
                    <Route path="/edit/:id" render={(props) =>(
                        <EditMovie 
                        {...props}
                        onEditMovie={(id, movie) => {
                            this.editMovie(id, movie)
                        }
                    }

                        />
                    )}>
    
                    </Route>
                </Switch>
            </div>

        </Router>
      )
  }
}

export default App;