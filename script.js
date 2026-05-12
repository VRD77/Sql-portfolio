// ── QUERY DATA ─────────────────────────────────────────────────────────────

const queries = {
  library: [
    {
      label: "Create Tables",
      title: "Create Books & Members Tables",
      code: `<span class="comment">-- Create the Books table</span>
<span class="kw">CREATE TABLE</span> Books (
  book_id    <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  title      <span class="fn">VARCHAR</span>(<span class="num">200</span>) <span class="kw">NOT NULL</span>,
  author     <span class="fn">VARCHAR</span>(<span class="num">100</span>),
  genre      <span class="fn">VARCHAR</span>(<span class="num">50</span>),
  quantity   <span class="fn">INT</span> <span class="kw">DEFAULT</span> <span class="num">1</span>
);

<span class="comment">-- Create the Members table</span>
<span class="kw">CREATE TABLE</span> Members (
  member_id  <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  name       <span class="fn">VARCHAR</span>(<span class="num">100</span>) <span class="kw">NOT NULL</span>,
  email      <span class="fn">VARCHAR</span>(<span class="num">100</span>) <span class="kw">UNIQUE</span>,
  joined_on  <span class="fn">DATE</span>
);`
    },
    {
      label: "Insert Sample Data",
      title: "Insert Books & Members",
      code: `<span class="comment">-- Add some books</span>
<span class="kw">INSERT INTO</span> Books (<span class="col">title</span>, <span class="col">author</span>, <span class="col">genre</span>, <span class="col">quantity</span>)
<span class="kw">VALUES</span>
  (<span class="str">'Clean Code'</span>,        <span class="str">'Robert C. Martin'</span>, <span class="str">'Tech'</span>,    <span class="num">3</span>),
  (<span class="str">'The Alchemist'</span>,     <span class="str">'Paulo Coelho'</span>,     <span class="str">'Fiction'</span>, <span class="num">5</span>),
  (<span class="str">'Atomic Habits'</span>,     <span class="str">'James Clear'</span>,      <span class="str">'Self-Help'</span>, <span class="num">4</span>),
  (<span class="str">'Harry Potter'</span>,      <span class="str">'J.K. Rowling'</span>,     <span class="str">'Fantasy'</span>, <span class="num">6</span>);

<span class="comment">-- Add members</span>
<span class="kw">INSERT INTO</span> Members (<span class="col">name</span>, <span class="col">email</span>, <span class="col">joined_on</span>)
<span class="kw">VALUES</span>
  (<span class="str">'Vimmy Roy'</span>,   <span class="str">'vimmy@mail.com'</span>,  <span class="str">'2024-01-15'</span>),
  (<span class="str">'Ananya Mehta'</span>, <span class="str">'ananya@mail.com'</span>, <span class="str">'2024-02-20'</span>);`
    },
    {
      label: "Overdue Books",
      title: "Find Overdue Loans",
      code: `<span class="comment">-- Get all loans that are overdue (not returned yet)</span>
<span class="kw">SELECT</span>
  m.<span class="col">name</span>            <span class="kw">AS</span> <span class="col">member_name</span>,
  b.<span class="col">title</span>           <span class="kw">AS</span> <span class="col">book_title</span>,
  l.<span class="col">due_date</span>,
  <span class="fn">DATEDIFF</span>(<span class="fn">CURDATE</span>(), l.<span class="col">due_date</span>) <span class="kw">AS</span> <span class="col">days_overdue</span>
<span class="kw">FROM</span>   Loans l
<span class="kw">JOIN</span>   Members m <span class="kw">ON</span> l.<span class="col">member_id</span> = m.<span class="col">member_id</span>
<span class="kw">JOIN</span>   Books   b <span class="kw">ON</span> l.<span class="col">book_id</span>   = b.<span class="col">book_id</span>
<span class="kw">WHERE</span>  l.<span class="col">returned</span> = <span class="num">0</span>
  <span class="kw">AND</span>  l.<span class="col">due_date</span> <span class="fn">&lt;</span> <span class="fn">CURDATE</span>()
<span class="kw">ORDER BY</span> days_overdue <span class="kw">DESC</span>;`
    },
    {
      label: "Genre Stats",
      title: "Books per Genre",
      code: `<span class="comment">-- Count books per genre, sorted by most popular</span>
<span class="kw">SELECT</span>
  genre,
  <span class="fn">COUNT</span>(*) <span class="kw">AS</span> <span class="col">total_books</span>,
  <span class="fn">SUM</span>(quantity) <span class="kw">AS</span> <span class="col">total_copies</span>
<span class="kw">FROM</span>  Books
<span class="kw">GROUP BY</span> genre
<span class="kw">ORDER BY</span> total_copies <span class="kw">DESC</span>;`
    },
    {
      label: "Overdue View",
      title: "Create Overdue View",
      code: `<span class="comment">-- A reusable VIEW for overdue books</span>
<span class="kw">CREATE VIEW</span> OverdueLoans <span class="kw">AS</span>
<span class="kw">SELECT</span>
  m.<span class="col">name</span>        <span class="kw">AS</span> <span class="col">member</span>,
  b.<span class="col">title</span>       <span class="kw">AS</span> <span class="col">book</span>,
  l.<span class="col">due_date</span>,
  <span class="fn">DATEDIFF</span>(<span class="fn">CURDATE</span>(), l.<span class="col">due_date</span>) <span class="kw">AS</span> <span class="col">days_late</span>,
  (<span class="fn">DATEDIFF</span>(<span class="fn">CURDATE</span>(), l.<span class="col">due_date</span>) * <span class="num">2</span>) <span class="kw">AS</span> <span class="col">fine_rupees</span>
<span class="kw">FROM</span>  Loans l
<span class="kw">JOIN</span>  Members m <span class="kw">ON</span> l.<span class="col">member_id</span> = m.<span class="col">member_id</span>
<span class="kw">JOIN</span>  Books   b <span class="kw">ON</span> l.<span class="col">book_id</span>   = b.<span class="col">book_id</span>
<span class="kw">WHERE</span> l.<span class="col">returned</span> = <span class="num">0</span>
  <span class="kw">AND</span> l.<span class="col">due_date</span> <span class="fn">&lt;</span> <span class="fn">CURDATE</span>();`
    }
  ],

  student: [
    {
      label: "Create Schema",
      title: "Students & Marks Tables",
      code: `<span class="comment">-- Student result tracker schema</span>
<span class="kw">CREATE TABLE</span> Students (
  student_id  <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  name        <span class="fn">VARCHAR</span>(<span class="num">100</span>) <span class="kw">NOT NULL</span>,
  roll_no     <span class="fn">VARCHAR</span>(<span class="num">20</span>) <span class="kw">UNIQUE</span>,
  branch      <span class="fn">VARCHAR</span>(<span class="num">50</span>)
);

<span class="kw">CREATE TABLE</span> Marks (
  mark_id     <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  student_id  <span class="fn">INT</span> <span class="kw">REFERENCES</span> Students(<span class="col">student_id</span>),
  subject     <span class="fn">VARCHAR</span>(<span class="num">80</span>),
  score       <span class="fn">INT</span>,
  max_score   <span class="fn">INT</span> <span class="kw">DEFAULT</span> <span class="num">100</span>
);`
    },
    {
      label: "Grade with CASE",
      title: "Assign Grades Using CASE",
      code: `<span class="comment">-- Calculate grade for each mark using CASE</span>
<span class="kw">SELECT</span>
  s.<span class="col">name</span>,
  m.<span class="col">subject</span>,
  m.<span class="col">score</span>,
  <span class="kw">CASE</span>
    <span class="kw">WHEN</span> m.<span class="col">score</span> >= <span class="num">90</span> <span class="kw">THEN</span> <span class="str">'A+'</span>
    <span class="kw">WHEN</span> m.<span class="col">score</span> >= <span class="num">80</span> <span class="kw">THEN</span> <span class="str">'A'</span>
    <span class="kw">WHEN</span> m.<span class="col">score</span> >= <span class="num">70</span> <span class="kw">THEN</span> <span class="str">'B'</span>
    <span class="kw">WHEN</span> m.<span class="col">score</span> >= <span class="num">60</span> <span class="kw">THEN</span> <span class="str">'C'</span>
    <span class="kw">ELSE</span> <span class="str">'Fail'</span>
  <span class="kw">END</span> <span class="kw">AS</span> <span class="col">grade</span>
<span class="kw">FROM</span>  Marks m
<span class="kw">JOIN</span>  Students s <span class="kw">ON</span> m.<span class="col">student_id</span> = s.<span class="col">student_id</span>
<span class="kw">ORDER BY</span> s.<span class="col">name</span>, m.<span class="col">subject</span>;`
    },
    {
      label: "Student Average",
      title: "Average Marks per Student",
      code: `<span class="comment">-- Average score per student, sorted by best performer</span>
<span class="kw">SELECT</span>
  s.<span class="col">name</span>,
  s.<span class="col">roll_no</span>,
  <span class="fn">ROUND</span>(<span class="fn">AVG</span>(m.<span class="col">score</span>), <span class="num">2</span>) <span class="kw">AS</span> <span class="col">avg_score</span>,
  <span class="fn">MIN</span>(m.<span class="col">score</span>)          <span class="kw">AS</span> <span class="col">lowest</span>,
  <span class="fn">MAX</span>(m.<span class="col">score</span>)          <span class="kw">AS</span> <span class="col">highest</span>
<span class="kw">FROM</span>   Students s
<span class="kw">JOIN</span>   Marks    m <span class="kw">ON</span> s.<span class="col">student_id</span> = m.<span class="col">student_id</span>
<span class="kw">GROUP BY</span> s.<span class="col">student_id</span>, s.<span class="col">name</span>, s.<span class="col">roll_no</span>
<span class="kw">ORDER BY</span> avg_score <span class="kw">DESC</span>;`
    },
    {
      label: "Rank Students",
      title: "Rank Using Window Function",
      code: `<span class="comment">-- Rank students by average score using RANK()</span>
<span class="kw">SELECT</span>
  s.<span class="col">name</span>,
  <span class="fn">ROUND</span>(<span class="fn">AVG</span>(m.<span class="col">score</span>), <span class="num">2</span>)                               <span class="kw">AS</span> <span class="col">avg_score</span>,
  <span class="fn">RANK</span>() <span class="kw">OVER</span> (<span class="kw">ORDER BY</span> <span class="fn">AVG</span>(m.<span class="col">score</span>) <span class="kw">DESC</span>)             <span class="kw">AS</span> <span class="col">rank_pos</span>
<span class="kw">FROM</span>   Students s
<span class="kw">JOIN</span>   Marks    m <span class="kw">ON</span> s.<span class="col">student_id</span> = m.<span class="col">student_id</span>
<span class="kw">GROUP BY</span> s.<span class="col">student_id</span>, s.<span class="col">name</span>
<span class="kw">ORDER BY</span> rank_pos;`
    }
  ],

  ecommerce: [
    {
      label: "Schema Setup",
      title: "E-Commerce Tables",
      code: `<span class="comment">-- E-Commerce schema</span>
<span class="kw">CREATE TABLE</span> Customers (
  customer_id  <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  name         <span class="fn">VARCHAR</span>(<span class="num">100</span>),
  city         <span class="fn">VARCHAR</span>(<span class="num">60</span>),
  email        <span class="fn">VARCHAR</span>(<span class="num">100</span>) <span class="kw">UNIQUE</span>
);

<span class="kw">CREATE TABLE</span> Products (
  product_id   <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  name         <span class="fn">VARCHAR</span>(<span class="num">150</span>),
  category     <span class="fn">VARCHAR</span>(<span class="num">60</span>),
  price        <span class="fn">DECIMAL</span>(<span class="num">10</span>,<span class="num">2</span>),
  stock        <span class="fn">INT</span>
);

<span class="kw">CREATE TABLE</span> Orders (
  order_id     <span class="fn">INT</span> <span class="kw">PRIMARY KEY AUTO_INCREMENT</span>,
  customer_id  <span class="fn">INT</span> <span class="kw">REFERENCES</span> Customers(<span class="col">customer_id</span>),
  order_date   <span class="fn">DATE</span>,
  total        <span class="fn">DECIMAL</span>(<span class="num">10</span>,<span class="num">2</span>)
);`
    },
    {
      label: "Revenue Report",
      title: "Monthly Revenue Report",
      code: `<span class="comment">-- Total revenue grouped by month</span>
<span class="kw">SELECT</span>
  <span class="fn">DATE_FORMAT</span>(order_date, <span class="str">'%Y-%m'</span>) <span class="kw">AS</span> <span class="col">month</span>,
  <span class="fn">COUNT</span>(*)                           <span class="kw">AS</span> <span class="col">total_orders</span>,
  <span class="fn">SUM</span>(total)                         <span class="kw">AS</span> <span class="col">revenue</span>
<span class="kw">FROM</span>   Orders
<span class="kw">GROUP BY</span> <span class="fn">DATE_FORMAT</span>(order_date, <span class="str">'%Y-%m'</span>)
<span class="kw">ORDER BY</span> month <span class="kw">DESC</span>;`
    },
    {
      label: "Top Customers",
      title: "Top 5 Customers by Spend",
      code: `<span class="comment">-- Find the top 5 customers by total spending</span>
<span class="kw">SELECT</span>
  c.<span class="col">name</span>,
  c.<span class="col">city</span>,
  <span class="fn">COUNT</span>(o.<span class="col">order_id</span>)   <span class="kw">AS</span> <span class="col">total_orders</span>,
  <span class="fn">SUM</span>(o.<span class="col">total</span>)        <span class="kw">AS</span> <span class="col">total_spent</span>
<span class="kw">FROM</span>   Customers c
<span class="kw">JOIN</span>   Orders    o <span class="kw">ON</span> c.<span class="col">customer_id</span> = o.<span class="col">customer_id</span>
<span class="kw">GROUP BY</span> c.<span class="col">customer_id</span>, c.<span class="col">name</span>, c.<span class="col">city</span>
<span class="kw">ORDER BY</span> total_spent <span class="kw">DESC</span>
<span class="kw">LIMIT</span> <span class="num">5</span>;`
    },
    {
      label: "Low Stock Alert",
      title: "Products with Low Stock",
      code: `<span class="comment">-- Products running low (stock < 5)</span>
<span class="kw">SELECT</span>
  name,
  category,
  price,
  stock
<span class="kw">FROM</span>  Products
<span class="kw">WHERE</span> stock <span class="fn">&lt;</span> <span class="num">5</span>
<span class="kw">ORDER BY</span> stock <span class="kw">ASC</span>;`
    },
    {
      label: "Category Revenue",
      title: "Revenue by Category",
      code: `<span class="comment">-- Revenue breakdown per product category</span>
<span class="kw">SELECT</span>
  p.<span class="col">category</span>,
  <span class="fn">SUM</span>(oi.<span class="col">qty</span> * p.<span class="col">price</span>) <span class="kw">AS</span> <span class="col">category_revenue</span>
<span class="kw">FROM</span>   Order_Items oi
<span class="kw">JOIN</span>   Products    p  <span class="kw">ON</span> oi.<span class="col">product_id</span> = p.<span class="col">product_id</span>
<span class="kw">GROUP BY</span> p.<span class="col">category</span>
<span class="kw">HAVING</span>   category_revenue <span class="fn">&gt;</span> <span class="num">1000</span>
<span class="kw">ORDER BY</span> category_revenue <span class="kw">DESC</span>;`
    }
  ]
};

// ── STATE ──────────────────────────────────────────────────────────────────

let currentTab     = 'library';
let currentQueryIdx = 0;

// ── INIT ───────────────────────────────────────────────────────────────────

// ── KEY ROW GENERATOR ─────────────────────────────────────────────────────

function init() {
  renderSidebar();
  loadQuery(0);

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      currentQueryIdx = 0;
      renderSidebar();
      loadQuery(0);
    });
  });

  // Project card links
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = link.dataset.project;
      // Switch tab
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === proj);
      });
      currentTab = proj;
      currentQueryIdx = 0;
      renderSidebar();
      loadQuery(0);
      document.getElementById('queries').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderSidebar() {
  const list = document.getElementById('query-list');
  const qs   = queries[currentTab];
  list.innerHTML = qs.map((q, i) =>
    `<div class="qv-item${i === currentQueryIdx ? ' active' : ''}" data-idx="${i}">${q.label}</div>`
  ).join('');
  list.querySelectorAll('.qv-item').forEach(item => {
    item.addEventListener('click', () => loadQuery(parseInt(item.dataset.idx)));
  });
}

function loadQuery(idx) {
  currentQueryIdx = idx;
  const q = queries[currentTab][idx];
  document.getElementById('query-label').textContent = q.title;
  document.getElementById('query-code').innerHTML    = q.code;
  document.querySelectorAll('.qv-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

function copyQuery() {
  const text = document.getElementById('query-code').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1800);
  });
}

// ── NAVBAR SCROLL ──────────────────────────────────────────────────────────

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 30
    ? '0 4px 20px rgba(0,0,0,0.4)'
    : 'none';
});

// ── RUN ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
