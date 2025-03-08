---
layout: page
title: Assignments
permalink: /assignments/
description: Course assignments organized by date.
nav: true
nav_order: 2
---

<div class="assignments">
  {% assign sorted_assignments = site.assignments | sort: "date" %}
  
  <ul class="assignment-list">
    {% for assignment in sorted_assignments %}
      <li class="assignment-item">
        <a class="assignment-link" href="{{ assignment.url | relative_url }}">
          <div class="assignment-card">
            <h3 class="assignment-title">{{ assignment.title }}</h3>
            <div class="assignment-meta">
              <span class="assignment-date">
                <i class="fas fa-calendar"></i> Start: {{ assignment.date | date: "%b %-d, %Y" }}
              </span>
              <span class="assignment-due-date">
                <i class="fas fa-clock"></i> Due: {{ assignment.due_date | date: "%b %-d, %Y" }}
              </span>
            </div>
            <div class="assignment-content">
              {{ assignment.description | truncate: 150 }}
            </div>
            <div class="assignment-footer">
              <div class="due-date-badge">Due: {{ assignment.due_date | date: "%b %-d, %Y" }}</div>
            </div>
          </div>
        </a>
      </li>
    {% endfor %}
  </ul>
</div>

<style>
  .assignment-list {
    list-style-type: none;
    padding-left: 0;
  }
  
  .assignment-item {
    margin-bottom: 1.5rem;
  }
  
  .assignment-link {
    text-decoration: none;
    color: inherit;
  }
  
  .assignment-card {
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: var(--global-bg-color);
    position: relative;
  }
  
  .assignment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .assignment-title {
    margin-top: 0;
    color: var(--global-theme-color);
  }
  
  .assignment-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--global-text-color-light);
  }
  
  .assignment-content {
    color: var(--global-text-color);
  }
  
  .assignment-footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .due-date-badge {
    background-color: var(--global-theme-color);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .assignment-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  /* Dark mode specific overrides */
  html[data-theme="dark"] .assignment-card {
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  html[data-theme="dark"] .assignment-card:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }
</style>
