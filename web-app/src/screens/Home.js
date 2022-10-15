import './Home.scss'
import ScrollReveal from 'scrollreveal'
import {useEffect} from 'react'

function Home() {
    useEffect(() => {
        ScrollReveal().reveal('.heading', { delay: 0, duration: 1000, distance: '10px' })
        ScrollReveal().reveal('.searchBar', { delay: 500, duration: 1000, distance: '10px' })

    });

    return (
        <div class="home">
            <div class="container">
                <div class="heading">
                    <h1>Welcome to Rochester!</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et viverra est. Praesent gravida risus at lacus molestie, et convallis ex accumsan.</p>
                </div>

                <div class="searchBar">
                    <input type="text" class="search" placeholder="How can we help?"></input>
                </div>
            </div>
        </div>
    )
}

export default Home