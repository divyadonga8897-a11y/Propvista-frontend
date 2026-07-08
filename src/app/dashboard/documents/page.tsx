"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Printer, Send } from "lucide-react";
import { toast } from "sonner";

export default function MyLegalDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchRequests();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      // Get bookings for the user to extract their documents
      // Assuming a dedicated endpoint for user documents or parsing from bookings
      const { data } = await api.get("/bookings/my");
      // Flatten all documents from bookings
      const docs = data.flatMap((booking: any) => booking.documents || []);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/resident-access/me");
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleRequestAccess = async (doc: any) => {
    try {
      await api.post("/resident-access/", {
        booking_id: doc.booking_id,
        flat_id: doc.flat_id,
        document_id: doc.id
      });
      toast.success("Resident access requested successfully!");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to request access");
    }
  };

  const handlePreview = (docUrl: string) => {
    window.open(docUrl, "_blank");
  };

  const handlePrint = (docUrl: string) => {
    const printWindow = window.open(docUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const getRequestStatus = (docId: string) => {
    const req = requests.find((r) => r.document_id === docId);
    return req ? req.status : null;
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading documents...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
          My Legal Documents
        </h1>
        <p className="text-lg text-slate-500">
          View your legal agreements, invoices, and request resident access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          const reqStatus = getRequestStatus(doc.id);
          const isAgreement = doc.doc_type.includes("Agreement");

          return (
            <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {reqStatus && (
                    <Badge variant={reqStatus === 'Approved' ? 'success' : reqStatus === 'Pending' ? 'warning' : 'destructive'}>
                      Access: {reqStatus}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-xl">{doc.name}</CardTitle>
                <div className="text-sm text-slate-500">{doc.doc_type}</div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => handlePreview(doc.file_url)}>
                    <Eye className="w-4 h-4 mr-2" /> Preview
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handlePrint(doc.file_url)}>
                    <Printer className="w-4 h-4 mr-2" /> Print PDF
                  </Button>
                </div>
                
                {isAgreement && !reqStatus && (
                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 transition-colors" 
                    onClick={() => handleRequestAccess(doc)}
                  >
                    <Send className="w-4 h-4 mr-2" /> Request Resident Access
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="text-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">No documents found</h3>
          <p className="text-slate-500 mt-2">You don't have any legal documents or invoices yet.</p>
        </div>
      )}
    </div>
  );
}
