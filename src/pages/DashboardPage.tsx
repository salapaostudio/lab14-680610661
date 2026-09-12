import { useEffect, useState } from "react";
import UserRegisterCard from "../components/UserRegisterCard";
import {
  REGISTRANTS_STORAGE_KEY,
  type Registrant,
} from "../libs/Registrant";

export default function DashboardPage() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);

  useEffect(() => {
    // โหลดผู้ลงทะเบียนทุกคนจาก LocalStorage เมื่อเปิดหน้า Dashboard
    try {
      const savedData = localStorage.getItem(REGISTRANTS_STORAGE_KEY);
      setRegistrants(
        savedData === null ? [] : (JSON.parse(savedData) as Registrant[]),
      );
    } catch {
      setRegistrants([]);
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p className="text-secondary">ผู้ลงทะเบียนแล้ว ({registrants.length} คน)</p>

      {registrants.length === 0 ? (
        <div className="alert alert-light border text-center" role="status">
          ยังไม่มีผู้ลงทะเบียน
        </div>
      ) : (
        registrants.map((registrant) => (
          <UserRegisterCard key={registrant.id} registrant={registrant} />
        ))
      )}
    </div>
  );
}
