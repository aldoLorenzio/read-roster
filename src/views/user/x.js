<!DOCTYPE html>
<html>

<head>
  <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td,
    th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #dddddd;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
    }

    #borrowBookForm {
      display: none;
      position: fixed;

      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 20px;
      z-index: 1000;

      border: 1px solid #ddd;
    }


    #overlay {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
  </style>
</head>

<body>
  <div class="dashboard-header">
    <h1>Welcome, <%= user.name %>!</h1>
    <button>Logout</button>
  </div>

  <div style="padding: 14px">
    <p>Email: <%= user.email %>
    </p>
    <p>Role: <%= user.role %>
    </p>
    <p>Account Created: <%= new Date(user.createdAt).toLocaleDateString() %> at <%= new
          Date(user.createdAt).toLocaleTimeString() %>
    </p>
    <p>Last Updated: <%= new Date(user.updateAt).toLocaleDateString() %> at <%= new
          Date(user.updateAt).toLocaleTimeString() %>
    </p>
    <p>Email Verified: <%= user.isEmailVerified ? 'Yes' : 'No' %>
    </p>
  </div>

  <div style="padding: 14px">
    <button onclick="toggleBorrowBookForm()">Borrow A Book</button> <!-- Dipindahkan ke sini -->
    <table>
      <tr>
        <th>Loan Information</th>
      </tr>

      <tr>
        <th>ID</th>
        <th>Book ID</th>
        <th>Date Borrow</th>
        <th>Date Due</th>
        <th>Date Returned</th>
      </tr>
    </table>


    <div id="overlay" onclick="toggleBorrowBookForm()" style="display:none;"></div>
    <div id="borrowBookForm" style="display:none;">
      <form action="/v1/peminjaman" method="post">

        <label for="bukuId">Book ID:</label>
        <input type="text" id="bukuId" name="bukuId" required>
        <label for="date_borrow">Date Borrow:</label>
        <input type="date" id="date_borrow" name="date_borrow" required>
        <label for="date_due">Date Due:</label>
        <input type="date" id="date_due" name="date_due" required>
        <input type="submit" value="Submit">
      </form>
      <button onclick="toggleBorrowBookForm()">Close</button>
    </div>
    <script>
      function toggleBorrowBookForm() {
        var form = document.getElementById('borrowBookForm');
        var overlay = document.getElementById('overlay');
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
        overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
      }
    </script>
</body>

</html>
