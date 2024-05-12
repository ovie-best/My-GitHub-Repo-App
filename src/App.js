import { useEffect, useState } from "react";
// import { ChakraProvider } from "@chakra-ui/react";
// import { Box } from "@chakra-ui/react";

export default function App() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [repos, setRepos] = useState([]);
  // const [repoName, setRepoName] = useState("");

  const [isloading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [numOfRepos, setNumOfRepos] = useState([]);
  const reposPerPage = 3;
  const lastIndex = currentPage * reposPerPage;
  const firstIndex = lastIndex - reposPerPage;
  const [data, setData] = useState("");
  // const [repoInfo, setRepoInfo] = useState(false);

  useEffect(
    function () {
      async function myGithubProfile() {
        setIsLoading(true);
        const res = await fetch("https://api.github.com/users/ovie-best");
        setData(await res.json());
        setName(data.name);
        setAvatar(data.avatar_url);
        setIsLoading(false);
      }

      myGithubProfile();
    },
    [data.avatar_url, data.name]
  );

  useEffect(
    function () {
      async function myRepos() {
        setIsLoading(true);
        const res = await fetch("https://api.github.com/users/ovie-best/repos");
        const data = await res.json();
        // setRepoName(data.name);
        // console.log(data.map((n) => n.name));
        setRepos(data.slice(firstIndex, lastIndex));
        setNumOfRepos(Math.ceil(data.length / reposPerPage));
        setNumbers([...Array(numOfRepos + 1).keys()].slice(1));
        setIsLoading(false);
      }

      myRepos();
    },
    [firstIndex, lastIndex, numOfRepos]
  );

  function handlePrevious() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCurrentPage(id) {
    setCurrentPage(id);
  }

  function handleNext() {
    if (currentPage !== numOfRepos) {
      setCurrentPage(currentPage + 1);
    }
  }

  // function showRepoDetails() {
  //   if (repoInfo === true) {
  //     setRepoInfo(false);
  //   } else {
  //     setRepoInfo(true);
  //   }
  // }

  return (
    <main>
      <div className="container">
        <div className="myInfo">
          <div className="avatar">
            <img src={avatar} alt={name} />
          </div>
          <div className="details">
            <h1>{name}</h1>
            {/* <p>GitHub Username: @{data.login}</p>
            <p>Email: </p>
            <p>Phone: </p> */}
            <p>Bio: {data.bio}</p>
            <p>Repositories: {data.public_repos}</p>
            <p>Followers: {data.followers}</p>
          </div>
        </div>
        <div className="Repos">
          <Repos isloading={isloading} repos={repos} key={crypto.randomUUID} />
          <ul className="pagination">
            <li className="p">
              <button onClick={handlePrevious}>Prev</button>
            </li>
            {numbers.map((n, i) => {
              return (
                <li key={i} className="p">
                  <button onClick={() => changeCurrentPage(n)}>{n}</button>{" "}
                </li>
              );
            })}
            <li className="p">
              <button onClick={handleNext}>Next</button>
            </li>
          </ul>
        </div>
      </div>

      {/* <div>
        <RepoDetails
          showRepoDetails={showRepoDetails}
          repoInfo={repoInfo}
          // repoName={repoName}
        />
      </div> */}
    </main>
  );
}

function Repos({ repos, isloading }) {
  if (isloading) {
    return <h1>Loading...</h1>;
  }

  const description = repos.map((repo) => repo.description);
  // console.log(description);
  return (
    // <ChakraProvider>
    <section className="my-repos">
      <div className="repoNav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="./github.png" alt="git-logo" className="git-logo" />
          <h1 style={{ textTransform: "uppercase" }}>My-Repositories</h1>
        </div>
        <input placeholder="search repos" type="text"></input>
      </div>
      <div className="r">
        {repos.map((repo) => (
          <div key={repo.id} className="Repo">
            <h2>{repo.name}</h2>
            <p>{repo.description ? description : "No Description"}</p>
          </div>
        ))}
      </div>
    </section>
    // </ChakraProvider>
  );
}

// function RepoDetails({ showRepoDetails, repoInfo, repoName }) {
//   const [singleRepo, setSingleRepo] = useState([]);

//   useEffect(
//     function () {
//       async function myRepos() {
//         const res = await fetch(
//           `https://api.github.com/repos/ovie-best/${repoName}`
//         );
//         const data = await res.json();
//         setSingleRepo(data);
//       }

//       myRepos();
//     },
//     [repoName]
//   );

//   return (
//     <div>

//       {repoInfo && <p>{singleRepo.description}</p>}
//     </div>
//   );
// }
