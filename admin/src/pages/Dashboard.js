import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const API_BASE = "http://localhost:5000/api";

function StatCard({ title, value, subtitle, colorClass }) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <div className="text-muted small">{title}</div>
            <div className="fs-3 fw-bold">{value}</div>
            {subtitle ? <div className="small text-muted">{subtitle}</div> : null}
          </div>
          <div className={`rounded-3 px-3 py-2 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
}

function Bars({ data }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value || 0)), [data]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="mb-3">Overview</h5>
        <div className="d-flex flex-column gap-3">
          {data.map((d) => {
            const pct = Math.round(((d.value || 0) / max) * 100);
            return (
              <div key={d.key}>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">{d.label}</span>
                  <span className="fw-semibold">{d.value}</span>
                </div>
                <div className="progress" style={{ height: 10 }}>
                  <div
                    className={`progress-bar ${d.barClass}`}
                    role="progressbar"
                    style={{ width: `${pct}%` }}
                    aria-valuenow={d.value}
                    aria-valuemin="0"
                    aria-valuemax={max}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = getUser();
  const isSuperAdmin = user?.role === "super";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ articles: 0, categories: 0, users: 0 });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE}/articles?page=1&limit=1`),
          axios.get(`${API_BASE}/categories`),
        ]);

        const articlesTotal = Number(articlesRes?.data?.total ?? 0);
        const categoriesCount = Array.isArray(categoriesRes?.data?.data)
          ? categoriesRes.data.data.length
          : 0;

        let usersCount = 0;
        if (isSuperAdmin) {
          const token = getToken();
          const usersRes = await axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          usersCount = Array.isArray(usersRes?.data) ? usersRes.data.length : 0;
        }

        if (!cancelled) {
          setStats({ articles: articlesTotal, categories: categoriesCount, users: usersCount });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || "Failed to load dashboard stats.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  const barData = useMemo(
    () => [
      { key: "articles", label: "Total Articles", value: stats.articles, barClass: "bg-primary" },
      { key: "categories", label: "Total Categories", value: stats.categories, barClass: "bg-success" },
      { key: "users", label: "Total Users", value: stats.users, barClass: "bg-warning text-dark" },
    ],
    [stats]
  );

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h3 className="mb-0">Dashboard</h3>
          <div className="text-muted small">Quick overview of your content and users.</div>
        </div>
        {loading ? <span className="badge text-bg-secondary">Loading…</span> : null}
      </div>

      {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <StatCard title="Total Articles" value={stats.articles} subtitle="All published posts" colorClass="bg-primary-subtle" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard title="Total Categories" value={stats.categories} subtitle="Available categories" colorClass="bg-success-subtle" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard
            title="Total Users"
            value={isSuperAdmin ? stats.users : "—"}
            subtitle={isSuperAdmin ? "Registered users" : "Super admin only"}
            colorClass="bg-warning-subtle"
          />
        </div>
      </div>

      <Bars data={barData} />
    </div>
  );
}
