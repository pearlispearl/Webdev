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
document.addEventListener("DOMContentLoaded", function() {
  // Your existing code

  // Add event listener for delete button if it exists on the page
  const deleteButton = document.querySelector(".delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", deleteArtist);
  }
});
