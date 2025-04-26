//ใส่ใน getartist ก่อน catch(error)

   result.data.forEach(artist => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="/image/Product_img/User.png" alt="${artist.ArtistName}'s profile">
        <div class="card-body">
          <h5 class="card-title">${artist.ArtistName}</h5>
          <p class="card-text">${artist.AboutMe ? artist.AboutMe.substring(0, 100) + (artist.AboutMe.length > 100 ? '...' : '') : 'No description available.'}</p>
          <p class="card-price">From: $${artist.BasePrice}</p>
          <a href="/artist_details?id=${artist.ArtistID}" class="btn btn-primary">View Details</a>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
    
