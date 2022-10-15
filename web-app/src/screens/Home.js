import './Home.scss'

function Home() {
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