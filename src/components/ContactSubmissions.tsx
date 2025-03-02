import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, Check, X, RefreshCw, Archive, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  ContactFormData,
  getContactSubmissions,
  updateContactStatus,
  deleteContactSubmission,
} from "@/lib/contact";

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("new");
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactFormData | null>(null);

  const fetchSubmissions = async (status?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getContactSubmissions(
        status !== "all" ? status : undefined,
      );
      if (data) {
        setSubmissions(data);
      } else {
        throw new Error("Failed to fetch contact submissions");
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to load contact submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(activeTab);
  }, [activeTab]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const success = await updateContactStatus(id, newStatus);
      if (success) {
        // Update the local state
        setSubmissions(
          submissions.map((sub) =>
            sub.id === id
              ? {
                  ...sub,
                  status: newStatus as "new" | "read" | "replied" | "archived",
                }
              : sub,
          ),
        );

        // If the selected submission was updated, update it too
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({
            ...selectedSubmission,
            status: newStatus as "new" | "read" | "replied" | "archived",
          });
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this submission? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const success = await deleteContactSubmission(id);
      if (success) {
        // Remove from local state
        setSubmissions(submissions.filter((sub) => sub.id !== id));

        // If the selected submission was deleted, clear it
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      } else {
        throw new Error("Failed to delete submission");
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
      setError("Failed to delete submission. Please try again.");
    }
  };

  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case "read":
        return <Badge className="bg-gray-100 text-gray-800">Read</Badge>;
      case "replied":
        return <Badge className="bg-green-100 text-green-800">Replied</Badge>;
      case "archived":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Archived</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Contact Submissions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSubmissions(activeTab)}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="new" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                <span className="ml-2">Loading submissions...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No submissions found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {submissions.map((submission) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`cursor-pointer hover:border-primary transition-colors ${selectedSubmission?.id === submission.id ? "border-primary" : ""}`}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        // Mark as read if it's new
                        if (submission.status === "new" && submission.id) {
                          handleStatusChange(submission.id, "read");
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium truncate">
                              {submission.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {submission.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(submission.createdAt)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(submission.status)}
                          </div>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">
                          {submission.message}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {selectedSubmission ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {selectedSubmission.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {selectedSubmission.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-400">
                          {formatDate(selectedSubmission.createdAt)}
                        </p>
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSendEmail(selectedSubmission.email)
                        }
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      {selectedSubmission.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(selectedSubmission.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedSubmission.id &&
                      selectedSubmission.status !== "read" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(selectedSubmission.id!, "read")
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    {selectedSubmission.id &&
                      selectedSubmission.status !== "replied" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              selectedSubmission.id!,
                              "replied",
                            )
                          }
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Mark as Replied
                        </Button>
                      )}
                    {selectedSubmission.id &&
                      selectedSubmission.status !== "archived" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              selectedSubmission.id!,
                              "archived",
                            )
                          }
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Archive
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 bg-gray-50 rounded-lg">
                <Mail className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Select a submission to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ContactSubmissions;
