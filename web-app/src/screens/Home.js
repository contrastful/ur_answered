import "./Home.scss";
import ScrollReveal from "scrollreveal";
import { useEffect, useState } from "react";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [classifications, setClassifications] = useState(null);

  useEffect(() => {
    ScrollReveal().reveal(".heading", {
      delay: 0,
      duration: 1000,
      distance: "10px",
    });
    ScrollReveal().reveal(".searchBar", {
      delay: 500,
      duration: 1000,
      distance: "10px",
    });
  });

  const onSubmit = async (e, queryOverride = null) => {
    if (e) e.preventDefault();

    try {
      const res = await fetch(
        `http://dandyhacks.up.railway.app/query?q=${
          queryOverride ? queryOverride : searchQuery
        }`,
        {
          method: "GET",
          mode: "cors",
        }
      );
      const response = await res.json();

      console.log(response);
      setAnswer(response.answer.answer);
      setClassifications(
        response.classifications.map((entry) => {
          return {
            matchedQuestion: entry.qna.question,
            score: entry.classification.score,
          };
        })
      );
      // setSearchQuery("")

      setTimeout(() => {
        ScrollReveal().reveal(".chatMessage", {
          // reset: true,
          delay: 0,
          duration: 1000,
          distance: "10px",
        });

        ScrollReveal().reveal(".related", {
          // reset: true,
          delay: 500,
          duration: 1000,
          distance: "10px",
        });
      }, 50);

      if (e) e.target.scrollIntoView({ behavior: "smooth", block: "start" });
      // If low score: Was one of these your question?
      // Prompt to fill out a form
    } catch (error) {
      // Returns null
      setAnswer(
        "Could not find a suitable answer. Please try being more specific."
      );

      console.error(error);
    }
  };

  return (
    <div class="home">
      <div class="container">
        <div class="heading">
          {/* <img
            src="../icon.jpg"
            alt="Icon with text 'UR Answered'"
            class="icon"
          /> */}
          <h1>Welcome to Rochester!</h1>
          <p>Ask a question.</p>
        </div>

        <div
          class="searchBar"
          style={{ marginTop: classifications ? "1rem" : "1rem" }}
        >
          <form action="" onSubmit={onSubmit}>
            <input
              type="text"
              className="search"
              placeholder="How can we help?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // minRows={ 1 }
              // maxRows={ 4 }
            />
            {/* <input type="submit" /> */}
          </form>
        </div>
      </div>

      {answer ? (
        <div class="chat">
          {classifications != null && (
            <p class="matchedQuestion chatMessage">
              {classifications[0].matchedQuestion}
            </p>
          )}
          <p class="response chatMessage">{answer}</p>
        </div>
      ) : null}

      {answer && classifications && classifications.length > 0 ? (
        <div class="related">
          <h2>Related questions</h2>
          <div>
            {classifications[1] ? (
              <a
                href="#"
                class="relatedQuestion"
                onClick={async (e) => {
                  e.preventDefault();
                  setSearchQuery(classifications[1].matchedQuestion);
                  setAnswer(null);
                  setClassifications(null);
                  setTimeout(() => {
                    onSubmit(null, classifications[1].matchedQuestion);
                  }, 30);
                }}
              >
                {classifications[1].matchedQuestion}
              </a>
            ) : null}

            {classifications[2] ? (
              <a
                href="#"
                class="relatedQuestion"
                onClick={async (e) => {
                  e.preventDefault();
                  setSearchQuery(classifications[2].matchedQuestion);
                  setAnswer(null);
                  setClassifications(null);
                  setTimeout(() => {
                    onSubmit(null, classifications[2].matchedQuestion);
                  }, 30);
                }}
              >
                {classifications[2].matchedQuestion}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Home;
