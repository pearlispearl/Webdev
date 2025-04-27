let toggleMenu = () => {
  document.getElementById("sidebar").classList.toggle("active");
}
const translatableElements = document.querySelectorAll("[data-en]");

const rooturl = "http://localhost:3031/"

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

let DisplayArtist = () => {
  const artistNameElement = document.getElementById("artistName");
  const artistAboutMeElement = document.getElementById("artistAboutMe");
  const artistLanguageElement = document.getElementById("artistLanguage");
  const artistCountryElement = document.getElementById("artistCountry");
  const artistCategoryElement = document.getElementById("artistCategory");
  const artiststatusElement = document.getElementById("artistStatus");
  const artistIDElement = document.getElementById("artistID");
  const artistBasepriceElement = document.getElementById("artistBaseprice")
  const artistPhotoElement = document.getElementById("artist-photo");
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get('id');

  if (artistId) {
    fetch(`${rooturl}artist/artists/${artistId}`)
      .then(response => response.json())
      .then(data => {
        if (!data.error && data.data) {
          const artist = data.data;
          if (artistPhotoElement ) {
            artistPhotoElement.src = artist.PhotoPath;
          }
          if (artistNameElement) {
            artistNameElement.textContent = artist.ArtistName;
          }
          if (artistAboutMeElement) {
            artistAboutMeElement.textContent = artist.AboutMe;
          }
          if (artistLanguageElement) {
            artistLanguageElement.textContent = artist.ArtistLanguage;
          }
          if (artistCountryElement) {
            artistCountryElement.textContent = artist.ArtistCountry;
          }
          if (artistCategoryElement) {
            artistCategoryElement.textContent = artist.ArtistCategoryName;
          }
          if (artiststatusElement) {
            artiststatusElement.textContent = artist.Status;
          }
          if (artistBasepriceElement) {
            artistBasepriceElement.textContent = artist.BasePrice;
          }
          if (artistIDElement) {
            artistIDElement.textContent = artist.ArtistID;
          }
          
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

let getArtists = () => {
  const category = document.getElementById("category").value;
  const name = document.getElementById("name").value.trim();
  const availableRadio = document.getElementById("available");
  const allRadio = document.getElementById("all");
  const basePriceInput = document.getElementById("baseprice"); // Get the input element
  const basePrice = basePriceInput ? basePriceInput.value.trim() : "";
  let status = "";

  if (availableRadio && availableRadio.checked) {
    status = "Available";
  } else if (allRadio && allRadio.checked) {
    status = "all"; // "Show all" means no status filter
  }
  const rooturl = "http://localhost:3031/"; // Ensure this is correct
  // const divOutput = document.getElementById("output");
  let apiUrl = rooturl + "artist/artists"; // Default URL to get all artists

  const categoryMapReverse = {
    "Anime Style": "CAT000000001",
    "Realism": "CAT000000002",
    "Cartoon": "CAT000000003",
    "Pixel Art": "CAT000000004",
    "Chibi": "CAT000000005"
  };

  const categoryId = categoryMapReverse[category];
  if (status && basePrice && categoryId && name) { // Status + Base + Category + Name
    apiUrl = `${rooturl}artist/statusbasecategoryname/${encodeURIComponent(status)}/${encodeURIComponent(basePrice)}/${encodeURIComponent(categoryId)}/${encodeURIComponent(name)}`;
  }
  else if (basePrice && categoryId && status !== "") {
    apiUrl = `${rooturl}artist/statusbasecategory/${encodeURIComponent(status)}/${encodeURIComponent(basePrice)}/${encodeURIComponent(categoryId)}`;
  }
  else if (name && basePrice && status !== "") {
    apiUrl = `${rooturl}artist/statusnamebaseprice/${encodeURIComponent(status)}/${encodeURIComponent(name)}/${encodeURIComponent(basePrice)}`;
  }
  else if (name && categoryId && status !== "") {
    apiUrl = `${rooturl}artist/statuscategoryname/${encodeURIComponent(status)}/${encodeURIComponent(categoryId)}/${encodeURIComponent(name)}`;
  }
  else if (basePrice && status) {
    apiUrl = `${rooturl}artist/statusbaseprice/${encodeURIComponent(status)}/${encodeURIComponent(basePrice)}`;
  }
  else if (name && status !== "") { // Search by name and a specific status
    apiUrl = `${rooturl}artist/namestatus/${encodeURIComponent(name)}/${status}`;
  }
  else if (categoryId && status !== "") { // status + category
    apiUrl = `${rooturl}artist/statuscategory/${encodeURIComponent(status)}/${encodeURIComponent(categoryId)}`;
  }


  fetch(apiUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    })
    .then((data) => {
      const artists = data.data;
      // let output = "<h1 class='list'>Search Results</h1>";
      // if (artists && artists.length > 0) {
      //   output += "<article class='container'>";
      //   artists.forEach(artist => {
      //     output += "<article class='column'>";
      //     output += `<p><strong>Name:</strong> ${artist.ArtistName}</p>`;
      //     output += `<p><strong>About me:</strong> ${artist.AboutMe}</p>`;
      //     // const categoryName = artist.ArtistCategory ||
      //     //   (artist.ACID && Object.entries(categoryMapReverse).find(([name, id]) => id === artist.ACID)?.[0]) ||
      //     //   'Unknown Category';
      //     output += `<p><strong>Base Price:</strong> ${artist.BasePrice}</p>`;
      //     output += `<p><strong>Category:</strong> ${artist.ArtistCategory || artist.ACID}</p>`; // Display category name if available
      //     output += `<p><strong>Status:</strong> ${artist.Status}</p>`;
      //     output += "</article>";
      //   });
      //   output += "</article>";
      // } else {
      //   output += "<p>No artists found matching your criteria.</p>";
      // }
      
      localStorage.setItem('searchResults', JSON.stringify(artists || []));
      window.location.href = `/search_artist`;
      // divOutput.innerHTML = output;
      
    })

    // .catch((error) => {
    //   console.error("Error fetching artists:", error);
    //   divOutput.innerHTML = "<p>Failed to load artists.</p>";
    // });
    .catch((error) => {
      console.error("Error fetching artists:", error);
      localStorage.setItem('searchResultsError', "Failed to load artists.");
      window.location.href = '/search_artist';
    });
};

function displaySearchResults() {
  if (!window.location.pathname.includes("search_artist")) {
    return;
  }
  const resultsContainer = document.getElementById('container');
  if (!resultsContainer) {
    console.error("Results container not found on page");
    return;
  }
  const searchResultsJSON = localStorage.getItem('searchResults');
  const searchResultsError = localStorage.getItem('searchResultsError');


 // Clear storage after reading
 localStorage.removeItem('searchResultsError');
  
 if (searchResultsError) {
   resultsContainer.innerHTML = `<p class="error-message">${searchResultsError}</p>`;
   return;
 }
      if (searchResultsError) {
          resultsContainer.innerHTML = `<p class="error-message">${searchResultsError}</p>`;
          return;
      }

      if (searchResultsJSON) {
          const artists = JSON.parse(searchResultsJSON);
          if (artists && artists.length > 0) {
              let output = '';
              artists.forEach(artist => {
                // Create artist card HTML
        output += `
        <div class="artist-card">
          <div class="artist-image">
            <img src="${artist.PhotoPath || '/image/Product_img/User.png'}" 
                 alt="${artist.ArtistName}" 
                 onerror="this.src='/image/Product_img/User.png'">
          </div>
          <div class="artist-info">
            <h3>${artist.ArtistName}</h3>
            <p class="artist-description">${artist.AboutMe || 'No description available.'}</p>
            <p class="artist-price">Price: ${artist.BasePrice}</p>
            <a href="/artist_details?id=${artist.ArtistID}" class="view-button">View Details</a>
          </div>
        </div>`;
      });
              resultsContainer.innerHTML = output;
          } else {
              resultsContainer.innerHTML = '<p>No artists found matching your search criteria.</p>';
          }
      } else {
          resultsContainer.innerHTML = '<p>No search results available.</p>';
      }
  }




document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("artistForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const language = document.getElementById("language").value;
      const country = document.getElementById("country").value;
      const aboutMe = document.getElementById("Aboutme").value;
      const status = document.getElementById("status").checked ? "Available" : "Unavailable";
      const categoryText = document.getElementById("category").value;
      const BasePrice = document.getElementById("baseprice").value;
      const photoURL = document.getElementById("photoURL").value;
      
      const categoryMap = {
        "Anime Style": "CAT000000001",
        "Realism": "CAT000000002",
        "Cartoon": "CAT000000003",
        "Pixel Art": "CAT000000004",
        "Chibi": "CAT000000005"
      };


      const ACID = categoryMap[categoryText] || "CAT000000001";
      
      const artistData = {
        ArtistName: name,
        ArtistLanguage: language,
        ArtistCountry: country,
        ACID: ACID,
        BasePrice: BasePrice,
        Status: status,
        AboutMe: aboutMe,
        photoURL: photoURL // Add the photo URL
      };

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
  if (window.location.pathname.includes("search")) {
    const btnSearch = document.getElementById("btnSearch");
    if (btnSearch) {
      btnSearch.addEventListener("click", getArtists);
    }

    // Optional: Clear button functionality
    const btnClear = document.getElementById("btnClear");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        document.getElementById("category").value = "";
        document.getElementById("name").value = "";
        document.getElementById("baseprice").value = "";
        document.getElementById("output").innerHTML = "";
      });
    }

  }

  if (window.location.pathname.includes("search_artist")) {
    displaySearchResults();
  }

  

  // Add this to your script.js file
  async function deleteArtist() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (!artistId) {
      alert("Error: No artist ID found");
      return;
    }

    if (confirm("Are you sure you want to delete this artist?")) {
      try {
        const response = await fetch(`${rooturl}artist/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ArtistID: artistId })
        });

        const result = await response.json();
        if (!result.error) {
          alert("Artist deleted successfully!");
          // Redirect to the product page or search page
          window.location.href = "/product";
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        console.error("Delete request failed:", error);
        alert("Failed to delete artist. Please try again.");
      }
    }
  }

  // Connect this function to your delete button
  // Modify your existing code in the DOMContentLoaded event listener


  if (window.location.pathname.includes("artist_details")) {
    DisplayArtist(); // Call DisplayArtist on the details page

    const deleteButton = document.getElementById("delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", deleteArtist);
    }
  }

  if (window.location.pathname.includes("admin_login")) {
    document.getElementById("btnLogin").addEventListener("click", function () {
      Getlogin()
    })
  }
  // if (window.location.pathname.includes("search")) {
  //   document.getElementById("btnSearch").addEventListener("click", function () {
  //     getArtists()
  //   })
  // }
});





