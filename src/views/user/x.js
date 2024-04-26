<br>
<select id="bukuId" name="bukuId" required>
  <% availableBooks.forEach(function(book) { %>
    <option value="<%= book.id %>">
      <%= book.title %>
    </option>
    <% }) %>
</select><br>
