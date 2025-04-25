let toggleMenu = () => {
  document.getElementById("sidebar").classList.toggle("active");
}
const translatableElements = document.querySelectorAll("[data-en]");

const rooturl = "http://localhost:3031/"

let getArtists = () => {
  divOutput = document.getElementById("output");
  fetch(rooturl + "artists").then((res) => {
    if (res.ok) {
      return res.json();
    }
  }).then((data) => {
    artists = data.data;
    output = "<h1 class='list'>Artist List<h1>";
    output += "<article class='container'>";

    artists.forEach(artist => {
      output += "<article class='column'>";
      output += "<p>" + artist.ArtistName + "</p>"
      output += "<p>" + artist.AboutMe + "</p>"
      output += "</article>"
    });

    output += "</article>"
    divOutput.innerHTML = output;
  })
}

let DisplayUser = () => {
  const Usernamep = document.getElementById("username-placeholder");
  const username = localStorage.getItem("Username");

  if (!username) {
    console.warn("⚠️ No username in localStorage.");
    Usernamep.innerHTML = "👋 User";
    return;
  }

  fetch(`${rooturl}admin?username=${encodeURIComponent(username)}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched admin data:", data); // optional debug
      if (data.data && data.data.Username) {
        Usernamep.innerHTML = `👋 ${data.data.Username}`;
      } else {
        Usernamep.innerHTML = `👋 User`;
      }
    })
    .catch((err) => {
      console.error("Error fetching user data:", err);
      Usernamep.innerHTML = "👋 User";
    });
};
if (window.location.pathname.includes("welcome")) {
document.addEventListener('DOMContentLoaded', function () {
  DisplayUser();
});
}


document.querySelectorAll('.lang-option').forEach(option => {
  option.addEventListener('click', function (e) {
    e.preventDefault();
    const selectedLang = this.getAttribute('data-lang');
    const langBtn = document.getElementById('langDropdown');
    langBtn.textContent = selectedLang.toUpperCase();

    document.querySelectorAll('[data-en]').forEach(el => {
      const en = el.getAttribute('data-en');
      const th = el.getAttribute('data-th');
      el.textContent = (selectedLang === 'en') ? en : th;
    });
  });
});


async function callArtistWS(url, method, sentData = {}) {
  console.log("Calling web service")
  let data;
  if (method == "select") {
    console.log("select")
    let response = await fetch(url,
      {
        method: 'GET'
      });
    data = await response.json();
  }
  else if (method == "insert") {
    console.log("insert")
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sentData)
    });
    data = await response.json();
  }
  else if (method == "update") {
    console.log("update")
    let response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sentData)
    });
    data = await response.json();
  }
  else if (method == "delete") {
    console.log("delete")
    let response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sentData)
    });
    data = await response.json();
  }
  return data;
}

async function Getlogin() {
  const AdminUser = document.querySelector("#username").value;
  const AdminPassword = document.querySelector("#password").value;
  const data = {
    Username: AdminUser,
    Password: AdminPassword
  };
  const response = await callArtistWS(rooturl + "login", "insert", data)
  if (response.status === 200) {
    localStorage.setItem("Username", response.Username);
    console.log("Successfully Login");
    alert("Successfully Login");
    window.location.href = "/welcome";
  }
  else if (response.status === 401) {
    console.log(response.message);
    alert("Error occurs T T")
  }
  else {
    alert('Please enter Username and Password');
  }
}

// let searchArtists = () => {
//   const ArtistName = document.querySelector("#name").value;
//   const ArtistID = document.querySelector("#ID").value;
//   const ArtistCountry = document.querySelector("#country").value;
//   const ArtistLanguage = document.querySelector("#language").value
//   const ArtistCategory = document.querySelector("#category").value;;
//   const ArtistStatus = document.querySelector("#status").value;
//   divOutput = document.getElementById("output");
//   if(!ArtistName && !ArtistID && !ArtistCategory){
//     callArtistWS(rooturl + "???","select")
//   }
//   fetch(rooturl + "artists").then((res) => {
//     if (res.ok) {
//       return res.json();
//     }
//   }).then((data) => {
//     artists = data.data;
//     output = "<table>"
//     output += "<th>"
//     output += "<td>Artist ID</td>"
//     output += "</th>"

//     artists.forEach(artist => {
//       output += "<tr>"
//       output += "<td>" + artist.ArtistID + "</td>"
//       output += "</tr>"
//     });

//     output += "</table>"
//     divOutput.innerHTML = output;
//   })
// }

let DisplayArtist = () => {
  const artistNameElement = document.getElementById("artistName");
  const artistAboutMeElement = document.getElementById("artistAboutMe");
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get('id');

  if (artistId) {
    fetch(`${rooturl}artist/artists/${artistId}`)
      .then(response => response.json())
      .then(data => {
        if (!data.error && data.data) {
          const artist = data.data;
          if (artistNameElement) {
            artistNameElement.textContent = artist.ArtistName;
          }
          if (artistAboutMeElement) {
            artistAboutMeElement.textContent = artist.AboutMe;
          }
          // You can fetch and display other artist details here
          // For example:
          // const artistLanguageElement = document.getElementById("artistLanguage");
          // if (artistLanguageElement) {
          //   artistLanguageElement.textContent = artist.ArtistLanguage;
          // }
        } else {
          alert("Error: Could not retrieve artist details.");
        }
      })
      .catch(error => {
        console.error("Error fetching artist details:", error);
        alert("Failed to fetch artist details.");
      });
  } else {
    alert("Error: Artist ID not provided in the URL.");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("artistForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const language = getElementById("language").value;
      const country = getElementById("country").value;
      const aboutMe = document.getElementById("Aboutme").value;
      const status = document.getElementById("status").checked ? "Available" : "Unavailable";
      const categoryText = document.getElementById("category").value;
      const categoryMap = {
        "Anime Style": "CAT000000001",
        "Realism": "CAT000000002",
        "Cartoon": "CAT000000003",
        "Pixel Art": "CAT000000004",
        "Chibi": "CAT000000005"
      };
      const ACID = categoryMap[categoryText] || "CAT000000001";
      const BasePrice = 100;
      const artistData = { ArtistName: name, ArtistLanguage: language, ArtistCountry: country, ACID: ACID, BasePrice: BasePrice, Status: status, AboutMe: aboutMe };

      try {
        const response = await fetch("http://localhost:3031/artist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(artistData)
        });
        const result = await response.json();
        if (result.error) {
          alert("Error: " + result.message);
        } else {
          alert("✅ " + result.message);
          form.reset();
          const newArtistId = result.data.ArtistID;
          window.location.href = `/artist_details?id=${newArtistId}`;
        }
      } catch (error) {
        console.error("Request failed:", error);
        alert("❌ Failed to add artist. Please check your connection.");
      }
    });
  }

if (window.location.pathname.includes("artist_details")) {
  DisplayArtist(); // Call DisplayArtist on the details page
}

if (window.location.pathname.includes("admin_login")) {
  document.getElementById("btnLogin").addEventListener("click", function () {
  Getlogin()
})
}
if (window.location.pathname.includes("search")) {
  document.getElementById("btnSearch").addEventListener("click", function () {
      getArtists()
    })
}
});



// fetch(`${rooturl}admin?username=${encodeURIComponent(username)}`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("Fetched admin data:", data); // optional debug
//       if (data.data && data.data.Username) {
//         artistName.innerHTML = `👋 ${data.data.Username}`;
//       } else {
//         artistName.innerHTML = `👋 User`;
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching user data:", err);
//       Usernamep.innerHTML = "👋 User";
//     });
