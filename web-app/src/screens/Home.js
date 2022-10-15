import "./Home.scss";
import ScrollReveal from "scrollreveal";
import { useEffect, useState } from "react";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [classifications, setClassifications] = useState();

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

  useEffect(() => {
    ScrollReveal().reveal(".chat", {
      delay: 0,
      duration: 1000,
      distance: "10px",
    });
  }, [answer]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/query?q=${searchQuery}`, {
        method: "GET",
        mode: "cors",
      });
      const response = await res.json();

      setAnswer(response.answer.answer);
      setClassifications(
        response.classifications.map((entry) => ({
          matchedQuestion: entry.qna.question,
          score: entry.classification.score,
        }))
      );

      e.target.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <img
            src="../icon.jpg"
            alt="Icon with text 'UR Answered'"
            class="icon"
          />
          <h1>Welcome to Rochester!</h1>
          <p>Ask a question.</p>
        </div>

        <div class="searchBar">
          <form action="" onSubmit={onSubmit}>
            <input
              type="text"
              class="search"
              placeholder="How can we help?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></input>
            {/* <input type="submit" /> */}
          </form>
        </div>

        {answer !== null && (
          <div class="chat">
            {classifications !== undefined && (
              <p class="matchedQuestion">
                {classifications[0].matchedQuestion}
              </p>
            )}
            {<p class="response">{answer}</p>}
          </div>
        )}

        {answer !== null && (
          <>
            <h2>Related questions</h2>
            <div class="related">
              {classifications[1] !== undefined && (
                <button
                  class="relatedQuestion"
                  onClick={async (e) => {
                    setSearchQuery(classifications[1].matchedQuestion);
                    await onSubmit(e);
                  }}
                >
                  {classifications[1].matchedQuestion}
                </button>
              )}

              {classifications[2] !== undefined && (
                <button
                  class="relatedQuestion"
                  onClick={async (e) => {
                    setSearchQuery(classifications[2].matchedQuestion);
                    await onSubmit(e);
                  }}
                >
                  {classifications[2].matchedQuestion}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
