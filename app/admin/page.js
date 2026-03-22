"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ID, Query } from "appwrite";
import { useRouter } from "next/navigation";
import { createDatabasesClient } from "../../lib/appwriteClient";

const sections = [
  { key: "home", label: "Home Page" },
  { key: "about", label: "About Us Page" },
  { key: "gallery", label: "Gallery Page" },
  { key: "blog", label: "Blog Page" },
  { key: "programs", label: "Programs Page" },
  { key: "testimonials", label: "Testimonials" },
  { key: "responses", label: "Responses" },
  { key: "partnerResponses", label: "Partner Requests" },
];

const homeImageFields = [
  { key: "HeroImage", label: "Hero Image" },
  { key: "BannerImageOne", label: "Banner Image One" },
  { key: "BannerImageTwo", label: "Banner Image Two" },
  { key: "BannerImageThree", label: "Banner Image Three" },
  { key: "AboutUsImage", label: "About Us Image" },
  { key: "OurMissionImageOne", label: "Our Mission Image One" },
  { key: "OurMissionImageTwo", label: "Our Mission Image Two" },
  { key: "OurMissionImageThree", label: "Our Mission Image Three" },
];

const homeTextFields = [
  { key: "AboutUsText", label: "About Us Text" },
  { key: "OurVisionText", label: "Our Vision Text" },
];

const homeFormFields = [...homeImageFields, ...homeTextFields];

const aboutImageFields = [
  { key: "OurStoryImage", label: "Our Story Image" },
  { key: "OurMissionImage", label: "Our Mission Image" },
  { key: "OurVisionImage", label: "Our Vision Image" },
];

const aboutTextFields = [
  { key: "OurStoryText", label: "Our Story Text" },
  { key: "OurMissionText", label: "Our Mission Text" },
  { key: "OurVisionText", label: "Our Vision Text" },
];

const galleryFields = [
  { key: "AllImages", label: "All Images" },
  { key: "TrainingImages", label: "Training Images" },
  { key: "CommunityImages", label: "Community Images" },
];

const createEmptyAboutMember = () => ({
  MembersImage: "",
  MemberPosition: "",
  MemberDescription: "",
});

const emptyHomeForm = homeFormFields.reduce((acc, field) => {
  acc[field.key] = "";
  return acc;
}, {});

const createEmptyAboutForm = () => ({
  OurStoryImage: "",
  OurMissionImage: "",
  OurVisionImage: "",
  Members: [createEmptyAboutMember()],
  OurStoryText: "",
  OurMissionText: "",
  OurVisionText: "",
});

const createEmptyGalleryForm = () => ({
  AllImages: [],
  TrainingImages: [],
  CommunityImages: [],
});

const createEmptyBlogForm = () => ({
  title: "",
  author: "",
  content: "",
  mainImage: "",
  publishedDate: "",
  tags: "",
});

const createEmptyProgramForm = () => ({
  title: "",
  image: "",
  mainText: "",
  importantPoints: [""],
});

const createEmptyTestimonialForm = () => ({
  name: "",
  image: "",
  text: "",
});

function sanitizeDocument(data) {
  const clean = { ...data };
  delete clean.$id;
  delete clean.$collectionId;
  delete clean.$databaseId;
  delete clean.$permissions;
  delete clean.$createdAt;
  delete clean.$updatedAt;
  return clean;
}

function extractYouTubeVideoId(url) {
  if (typeof url !== "string" || !url.trim()) return "";

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
    }

    return "";
  } catch {
    return "";
  }
}

export default function AdminPanelPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");
  const [documentId, setDocumentId] = useState("");
  const [editorValue, setEditorValue] = useState("{}");
  const [homeForm, setHomeForm] = useState(emptyHomeForm);
  const [aboutForm, setAboutForm] = useState(createEmptyAboutForm);
  const [galleryForm, setGalleryForm] = useState(createEmptyGalleryForm);
  const [blogForm, setBlogForm] = useState(createEmptyBlogForm);
  const [blogPosts, setBlogPosts] = useState([]);
  const [programForm, setProgramForm] = useState(createEmptyProgramForm);
  const [programs, setPrograms] = useState([]);
  const [testimonialForm, setTestimonialForm] = useState(
    createEmptyTestimonialForm,
  );
  const [testimonials, setTestimonials] = useState([]);
  const [contactResponses, setContactResponses] = useState([]);
  const [partnerResponses, setPartnerResponses] = useState([]);
  const [aboutRecordIds, setAboutRecordIds] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [replaceOnSave, setReplaceOnSave] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { databases, config } = useMemo(() => createDatabasesClient(), []);

  const cloudinaryCloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const cloudinaryUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  const collectionId = config.collections[activeSection];
  const isConfigMissing =
    !config.endpoint ||
    !config.projectId ||
    !config.databaseId ||
    !collectionId;

  const isCloudinaryConfigMissing =
    !cloudinaryCloudName || !cloudinaryUploadPreset;

  const isResponsesSection =
    activeSection === "responses" || activeSection === "partnerResponses";
  const showDeleteAction = false;

  const selectedContactResponse = useMemo(
    () =>
      contactResponses.find((response) => response.$id === documentId) ||
      contactResponses[0] ||
      null,
    [contactResponses, documentId],
  );

  const selectedPartnerResponse = useMemo(
    () =>
      partnerResponses.find((response) => response.$id === documentId) ||
      partnerResponses[0] ||
      null,
    [partnerResponses, documentId],
  );

  const mapTestimonialDocToForm = useCallback((data) => {
    return {
      name: typeof data.name === "string" ? data.name : "",
      image: typeof data.image === "string" ? data.image : "",
      text: typeof data.text === "string" ? data.text : "",
    };
  }, []);

  const mapProgramDocToForm = useCallback((data) => {
    const points = Array.isArray(data.importantPoints)
      ? data.importantPoints
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    return {
      title: typeof data.title === "string" ? data.title : "",
      image: typeof data.image === "string" ? data.image : "",
      mainText: typeof data.mainText === "string" ? data.mainText : "",
      importantPoints: points.length ? points : [""],
    };
  }, []);

  const toDateTimeLocalValue = useCallback((dateString) => {
    if (!dateString) return "";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return "";
    const pad = (value) => String(value).padStart(2, "0");
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
  }, []);

  const mapBlogDocToForm = useCallback(
    (data) => ({
      title: typeof data.title === "string" ? data.title : "",
      author: typeof data.author === "string" ? data.author : "",
      content: typeof data.content === "string" ? data.content : "",
      mainImage: typeof data.mainImage === "string" ? data.mainImage : "",
      publishedDate: toDateTimeLocalValue(data.publishedDate),
      tags: typeof data.tags === "string" ? data.tags : "",
    }),
    [toDateTimeLocalValue],
  );

  const applyLoadedData = useCallback(
    (data) => {
      setEditorValue(JSON.stringify(data, null, 2));
      setHomeForm((prev) => {
        const next = { ...prev };
        homeFormFields.forEach((field) => {
          next[field.key] =
            typeof data[field.key] === "string" ? data[field.key] : "";
        });
        return next;
      });

      const singleMemberFromDoc = {
        MembersImage:
          typeof data.MembersImage === "string" ? data.MembersImage : "",
        MemberPosition:
          typeof data.MemberPosition === "string" ? data.MemberPosition : "",
        MemberDescription:
          typeof data.MemberDescription === "string"
            ? data.MemberDescription
            : "",
      };

      const hasMemberData =
        singleMemberFromDoc.MembersImage ||
        singleMemberFromDoc.MemberPosition ||
        singleMemberFromDoc.MemberDescription;

      setAboutForm({
        OurStoryImage:
          typeof data.OurStoryImage === "string" ? data.OurStoryImage : "",
        OurMissionImage:
          typeof data.OurMissionImage === "string" ? data.OurMissionImage : "",
        OurVisionImage:
          typeof data.OurVisionImage === "string" ? data.OurVisionImage : "",
        Members: hasMemberData
          ? [singleMemberFromDoc]
          : [createEmptyAboutMember()],
        OurStoryText:
          typeof data.OurStoryText === "string" ? data.OurStoryText : "",
        OurMissionText:
          typeof data.OurMissionText === "string" ? data.OurMissionText : "",
        OurVisionText:
          typeof data.OurVisionText === "string" ? data.OurVisionText : "",
      });

      setGalleryForm({
        AllImages: Array.isArray(data.AllImages)
          ? data.AllImages.filter((item) => typeof item === "string")
          : [],
        TrainingImages: Array.isArray(data.TrainingImages)
          ? data.TrainingImages.filter((item) => typeof item === "string")
          : [],
        CommunityImages: Array.isArray(data.CommunityImages)
          ? data.CommunityImages.filter((item) => typeof item === "string")
          : [],
      });

      setBlogForm(mapBlogDocToForm(data));
    },
    [mapBlogDocToForm],
  );

  const handleLoad = useCallback(async () => {
    if (!databases) {
      setError("Appwrite client is not configured.");
      return;
    }

    if (!config.databaseId || !collectionId) {
      setError("Database ID or collection ID is missing.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setStatus("Loading content...");

      const result = await databases.listDocuments(
        config.databaseId,
        collectionId,
        [
          Query.limit(
            activeSection === "about" ||
              activeSection === "blog" ||
              activeSection === "programs" ||
              activeSection === "testimonials" ||
              activeSection === "responses" ||
              activeSection === "partnerResponses"
              ? 100
              : 1,
          ),
          ...(activeSection === "responses" ||
          activeSection === "partnerResponses"
            ? [Query.orderDesc("$createdAt")]
            : []),
        ],
      );

      if (!result.documents.length) {
        setDocumentId("");
        setAboutRecordIds([]);
        setEditorValue("{}");
        setHomeForm(emptyHomeForm);
        setAboutForm(createEmptyAboutForm());
        setGalleryForm(createEmptyGalleryForm());
        setBlogForm(createEmptyBlogForm());
        setBlogPosts([]);
        setProgramForm(createEmptyProgramForm());
        setPrograms([]);
        setTestimonialForm(createEmptyTestimonialForm());
        setTestimonials([]);
        setContactResponses([]);
        setPartnerResponses([]);
        setStatus("No document found in this collection.");
        return;
      }

      if (activeSection === "about") {
        const docs = result.documents;
        const firstDoc = sanitizeDocument(docs[0]);

        const members = docs.map((doc) => {
          const clean = sanitizeDocument(doc);
          return {
            MembersImage:
              typeof clean.MembersImage === "string" ? clean.MembersImage : "",
            MemberPosition:
              typeof clean.MemberPosition === "string"
                ? clean.MemberPosition
                : "",
            MemberDescription:
              typeof clean.MemberDescription === "string"
                ? clean.MemberDescription
                : "",
          };
        });

        setDocumentId(docs[0].$id);
        setAboutRecordIds(docs.map((doc) => doc.$id));
        setEditorValue(JSON.stringify(firstDoc, null, 2));
        setAboutForm({
          OurStoryImage:
            typeof firstDoc.OurStoryImage === "string"
              ? firstDoc.OurStoryImage
              : "",
          OurMissionImage:
            typeof firstDoc.OurMissionImage === "string"
              ? firstDoc.OurMissionImage
              : "",
          OurVisionImage:
            typeof firstDoc.OurVisionImage === "string"
              ? firstDoc.OurVisionImage
              : "",
          Members: members.length ? members : [createEmptyAboutMember()],
          OurStoryText:
            typeof firstDoc.OurStoryText === "string"
              ? firstDoc.OurStoryText
              : "",
          OurMissionText:
            typeof firstDoc.OurMissionText === "string"
              ? firstDoc.OurMissionText
              : "",
          OurVisionText:
            typeof firstDoc.OurVisionText === "string"
              ? firstDoc.OurVisionText
              : "",
        });

        setStatus(`Loaded ${docs.length} member record(s).`);
        return;
      }

      if (activeSection === "blog") {
        const docs = result.documents;
        setBlogPosts(docs);
        setPrograms([]);
        setTestimonials([]);
        setContactResponses([]);
        setPartnerResponses([]);
        const firstDoc = docs[0];
        const cleanDoc = sanitizeDocument(firstDoc);
        setDocumentId(firstDoc.$id);
        setAboutRecordIds([]);
        setEditorValue(JSON.stringify(cleanDoc, null, 2));
        setBlogForm(mapBlogDocToForm(cleanDoc));
        setStatus(`Loaded ${docs.length} blog post(s).`);
        return;
      }

      if (activeSection === "programs") {
        const docs = result.documents;
        setPrograms(docs);
        setBlogPosts([]);
        setTestimonials([]);
        setContactResponses([]);
        setPartnerResponses([]);
        const firstDoc = docs[0];
        const cleanDoc = sanitizeDocument(firstDoc);
        setDocumentId(firstDoc.$id);
        setAboutRecordIds([]);
        setEditorValue(JSON.stringify(cleanDoc, null, 2));
        setProgramForm(mapProgramDocToForm(cleanDoc));
        setStatus(`Loaded ${docs.length} program record(s).`);
        return;
      }

      if (activeSection === "testimonials") {
        const docs = result.documents;
        setPrograms([]);
        setTestimonials(docs);
        setBlogPosts([]);
        setContactResponses([]);
        setPartnerResponses([]);
        const firstDoc = docs[0];
        const cleanDoc = sanitizeDocument(firstDoc);
        setDocumentId(firstDoc.$id);
        setAboutRecordIds([]);
        setEditorValue(JSON.stringify(cleanDoc, null, 2));
        setTestimonialForm(mapTestimonialDocToForm(cleanDoc));
        setStatus(`Loaded ${docs.length} testimonial record(s).`);
        return;
      }

      if (activeSection === "responses") {
        const docs = result.documents;
        const firstDoc = docs[0];
        setPrograms([]);
        setContactResponses(docs);
        setTestimonials([]);
        setPartnerResponses([]);
        setBlogPosts([]);
        setAboutRecordIds([]);
        setDocumentId(firstDoc?.$id || "");
        setEditorValue(
          firstDoc ? JSON.stringify(sanitizeDocument(firstDoc), null, 2) : "{}",
        );
        setStatus(`Loaded ${docs.length} contact response(s).`);
        return;
      }

      if (activeSection === "partnerResponses") {
        const docs = result.documents;
        const firstDoc = docs[0];
        setPrograms([]);
        setPartnerResponses(docs);
        setTestimonials([]);
        setContactResponses([]);
        setBlogPosts([]);
        setAboutRecordIds([]);
        setDocumentId(firstDoc?.$id || "");
        setEditorValue(
          firstDoc ? JSON.stringify(sanitizeDocument(firstDoc), null, 2) : "{}",
        );
        setStatus(`Loaded ${docs.length} partner request(s).`);
        return;
      }

      const doc = result.documents[0];
      const cleanDoc = sanitizeDocument(doc);
      setDocumentId(doc.$id);
      setAboutRecordIds([doc.$id]);
      setBlogPosts([]);
      setPrograms([]);
      setTestimonials([]);
      setContactResponses([]);
      setPartnerResponses([]);
      applyLoadedData(cleanDoc);
      setStatus(`Loaded document: ${doc.$id}`);
    } catch (loadError) {
      setError(loadError?.message || "Failed to load document.");
      setStatus("Load failed.");
    } finally {
      setIsLoading(false);
    }
  }, [
    activeSection,
    applyLoadedData,
    collectionId,
    config.databaseId,
    databases,
    mapBlogDocToForm,
    mapProgramDocToForm,
    mapTestimonialDocToForm,
  ]);

  const uploadToCloudinary = useCallback(
    async (file) => {
      if (isCloudinaryConfigMissing) {
        throw new Error(
          "Cloudinary config missing. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.",
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryUploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const cloudinaryError = await response.json().catch(() => ({}));
        throw new Error(
          cloudinaryError?.error?.message || "Cloudinary upload failed.",
        );
      }

      const data = await response.json();
      return data.secure_url;
    },
    [cloudinaryCloudName, cloudinaryUploadPreset, isCloudinaryConfigMissing],
  );

  const handleFileUpload = useCallback(
    async (fieldKey, file) => {
      if (!file) return;

      try {
        setError("");
        setUploadingField(fieldKey);
        setStatus(`Uploading ${fieldKey}...`);

        const imageUrl = await uploadToCloudinary(file);

        setHomeForm((prev) => ({ ...prev, [fieldKey]: imageUrl }));
        setEditorValue((prev) => {
          try {
            const parsed = JSON.parse(prev || "{}");
            parsed[fieldKey] = imageUrl;
            return JSON.stringify(parsed, null, 2);
          } catch {
            return prev;
          }
        });

        setStatus(`${fieldKey} uploaded.`);
      } catch (uploadError) {
        setError(uploadError?.message || "Image upload failed.");
        setStatus("Upload failed.");
      } finally {
        setUploadingField("");
      }
    },
    [uploadToCloudinary],
  );

  const handleHomeInputChange = useCallback((fieldKey, value) => {
    setHomeForm((prev) => {
      const next = { ...prev, [fieldKey]: value };
      setEditorValue(JSON.stringify(next, null, 2));
      return next;
    });
  }, []);

  const clearHomeField = useCallback(
    (fieldKey) => {
      handleHomeInputChange(fieldKey, "");
    },
    [handleHomeInputChange],
  );

  const handleAboutInputChange = useCallback((fieldKey, value) => {
    setAboutForm((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const clearAboutField = useCallback(
    (fieldKey) => {
      handleAboutInputChange(fieldKey, "");
    },
    [handleAboutInputChange],
  );

  const addAboutMemberField = useCallback(() => {
    setAboutForm((prev) => ({
      ...prev,
      Members: [...(prev.Members || []), createEmptyAboutMember()],
    }));
  }, []);

  const removeAboutMemberField = useCallback((index) => {
    setAboutForm((prev) => ({
      ...prev,
      Members: (prev.Members || []).filter((_, i) => i !== index),
    }));
  }, []);

  const clearAboutMembers = useCallback(() => {
    setAboutForm((prev) => ({ ...prev, Members: [createEmptyAboutMember()] }));
  }, []);

  const handleAboutMemberChange = useCallback((index, fieldKey, value) => {
    setAboutForm((prev) => {
      const nextMembers = [...(prev.Members || [])];
      nextMembers[index] = {
        ...(nextMembers[index] || createEmptyAboutMember()),
        [fieldKey]: value,
      };
      return { ...prev, Members: nextMembers };
    });
  }, []);

  const handleAboutImageUpload = useCallback(
    async (fieldKey, file) => {
      if (!file) return;

      try {
        setError("");
        setUploadingField(`about-${fieldKey}`);
        setStatus(`Uploading ${fieldKey}...`);

        const imageUrl = await uploadToCloudinary(file);

        setAboutForm((prev) => ({ ...prev, [fieldKey]: imageUrl }));
        setStatus(`${fieldKey} uploaded.`);
      } catch (uploadError) {
        setError(uploadError?.message || "Image upload failed.");
        setStatus("Upload failed.");
      } finally {
        setUploadingField("");
      }
    },
    [uploadToCloudinary],
  );

  const handleAboutMemberImageUpload = useCallback(
    async (index, file) => {
      if (!file) return;

      try {
        setError("");
        setUploadingField(`about-member-${index}`);
        setStatus(`Uploading member image ${index + 1}...`);

        const imageUrl = await uploadToCloudinary(file);

        setAboutForm((prev) => {
          const nextMembers = [...(prev.Members || [])];
          nextMembers[index] = {
            ...(nextMembers[index] || createEmptyAboutMember()),
            MembersImage: imageUrl,
          };
          return { ...prev, Members: nextMembers };
        });
        setStatus(`Member image ${index + 1} uploaded.`);
      } catch (uploadError) {
        setError(uploadError?.message || "Image upload failed.");
        setStatus("Upload failed.");
      } finally {
        setUploadingField("");
      }
    },
    [uploadToCloudinary],
  );

  const handleGalleryFilesUpload = useCallback(
    async (fieldKey, files) => {
      const pickedFiles = Array.from(files || []);
      if (!pickedFiles.length) return;

      try {
        setError("");
        setUploadingField(`gallery-${fieldKey}`);
        setStatus(`Uploading ${pickedFiles.length} image(s) to ${fieldKey}...`);

        const uploadedUrls = [];
        for (const file of pickedFiles) {
          const imageUrl = await uploadToCloudinary(file);
          uploadedUrls.push(imageUrl);
        }

        setGalleryForm((prev) => ({
          ...prev,
          [fieldKey]: [...(prev[fieldKey] || []), ...uploadedUrls],
        }));
        setStatus(`${uploadedUrls.length} image(s) added to ${fieldKey}.`);
      } catch (uploadError) {
        setError(uploadError?.message || "Image upload failed.");
        setStatus("Upload failed.");
      } finally {
        setUploadingField("");
      }
    },
    [uploadToCloudinary],
  );

  const removeGalleryImage = useCallback((fieldKey, index) => {
    setGalleryForm((prev) => ({
      ...prev,
      [fieldKey]: (prev[fieldKey] || []).filter((_, i) => i !== index),
    }));
  }, []);

  const clearGalleryField = useCallback((fieldKey) => {
    setGalleryForm((prev) => ({ ...prev, [fieldKey]: [] }));
  }, []);

  const handleBlogInputChange = useCallback((fieldKey, value) => {
    setBlogForm((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const handleBlogImageUpload = useCallback(
    async (file) => {
      if (!file) return;

      try {
        setError("");
        setUploadingField("blog-mainImage");
        setStatus("Uploading blog main image...");

        const imageUrl = await uploadToCloudinary(file);
        setBlogForm((prev) => ({ ...prev, mainImage: imageUrl }));
        setStatus("Blog main image uploaded.");
      } catch (uploadError) {
        setError(uploadError?.message || "Image upload failed.");
        setStatus("Upload failed.");
      } finally {
        setUploadingField("");
      }
    },
    [uploadToCloudinary],
  );

  const getBlogPayload = useCallback(() => {
    const publishedDate = blogForm.publishedDate
      ? new Date(blogForm.publishedDate).toISOString()
      : new Date().toISOString();

    return {
      title: (blogForm.title || "").trim(),
      author: (blogForm.author || "").trim(),
      content: (blogForm.content || "").trim(),
      mainImage: (blogForm.mainImage || "").trim() || null,
      publishedDate,
      tags: (blogForm.tags || "").trim() || null,
    };
  }, [blogForm]);

  const handleSelectBlogPost = useCallback(
    (doc) => {
      const cleanDoc = sanitizeDocument(doc);
      setDocumentId(doc.$id);
      setEditorValue(JSON.stringify(cleanDoc, null, 2));
      setBlogForm(mapBlogDocToForm(cleanDoc));
      setStatus(`Editing blog: ${cleanDoc.title || doc.$id}`);
      setError("");
    },
    [mapBlogDocToForm],
  );

  const handleCreateNewBlog = useCallback(() => {
    setDocumentId("");
    setBlogForm(createEmptyBlogForm());
    setEditorValue("{}");
    setStatus("Creating a new blog post.");
    setError("");
  }, []);

  const handleProgramInputChange = useCallback((fieldKey, value) => {
    setProgramForm((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const handleProgramPointChange = useCallback((index, value) => {
    setProgramForm((prev) => {
      const nextPoints = [...(prev.importantPoints || [""])];
      nextPoints[index] = value;
      return { ...prev, importantPoints: nextPoints };
    });
  }, []);

  const addProgramPointField = useCallback(() => {
    setProgramForm((prev) => ({
      ...prev,
      importantPoints: [...(prev.importantPoints || []), ""],
    }));
  }, []);

  const removeProgramPointField = useCallback((index) => {
    setProgramForm((prev) => {
      const nextPoints = (prev.importantPoints || []).filter(
        (_, pointIndex) => pointIndex !== index,
      );

      return {
        ...prev,
        importantPoints: nextPoints.length ? nextPoints : [""],
      };
    });
  }, []);

  const handleProgramImageUpload = useCallback(
    async (file) => {
      if (!file) return;

      try {
        setError("");
        setUploadingField("program-image");
        setStatus("Uploading program image...");

        const imageUrl = await uploadToCloudinary(file);
        setProgramForm((prev) => ({ ...prev, image: imageUrl }));
        setStatus("Program image uploaded.");
      } catch (uploadError) {
        setError(uploadError?.message || "Image upload failed.");
        setStatus("Upload failed.");
      } finally {
        setUploadingField("");
      }
    },
    [uploadToCloudinary],
  );

  const getProgramPayload = useCallback(
    () => ({
      title: (programForm.title || "").trim(),
      image: (programForm.image || "").trim(),
      mainText: (programForm.mainText || "").trim(),
      importantPoints: (programForm.importantPoints || [])
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    }),
    [programForm],
  );

  const handleSelectProgram = useCallback(
    (doc) => {
      const cleanDoc = sanitizeDocument(doc);
      setDocumentId(doc.$id);
      setEditorValue(JSON.stringify(cleanDoc, null, 2));
      setProgramForm(mapProgramDocToForm(cleanDoc));
      setStatus(`Editing program: ${cleanDoc.title || doc.$id}`);
      setError("");
    },
    [mapProgramDocToForm],
  );

  const handleCreateNewProgram = useCallback(() => {
    setDocumentId("");
    setProgramForm(createEmptyProgramForm());
    setEditorValue("{}");
    setStatus("Creating a new program record.");
    setError("");
  }, []);

  const handleTestimonialInputChange = useCallback((fieldKey, value) => {
    setTestimonialForm((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const getTestimonialPayload = useCallback(
    () => ({
      name: (testimonialForm.name || "").trim(),
      image: (testimonialForm.image || "").trim(),
      text: (testimonialForm.text || "").trim(),
    }),
    [testimonialForm],
  );

  const handleSelectTestimonial = useCallback(
    (doc) => {
      const cleanDoc = sanitizeDocument(doc);
      setDocumentId(doc.$id);
      setEditorValue(JSON.stringify(cleanDoc, null, 2));
      setTestimonialForm(mapTestimonialDocToForm(cleanDoc));
      setStatus(`Editing testimonial: ${cleanDoc.name || doc.$id}`);
      setError("");
    },
    [mapTestimonialDocToForm],
  );

  const handleCreateNewTestimonial = useCallback(() => {
    setDocumentId("");
    setTestimonialForm(createEmptyTestimonialForm());
    setEditorValue("{}");
    setStatus("Creating a new testimonial record.");
    setError("");
  }, []);

  const getGalleryPayload = useCallback(
    () => ({
      AllImages: (galleryForm.AllImages || [])
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
      TrainingImages: (galleryForm.TrainingImages || [])
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
      CommunityImages: (galleryForm.CommunityImages || [])
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    }),
    [galleryForm],
  );

  const getAboutPayloads = useCallback(() => {
    const base = {
      OurStoryImage: aboutForm.OurStoryImage || "",
      OurMissionImage: aboutForm.OurMissionImage || "",
      OurVisionImage: aboutForm.OurVisionImage || "",
      OurStoryText: aboutForm.OurStoryText || "",
      OurMissionText: aboutForm.OurMissionText || "",
      OurVisionText: aboutForm.OurVisionText || "",
    };

    const members = (aboutForm.Members || [])
      .map((member) => ({
        MembersImage:
          typeof member?.MembersImage === "string"
            ? member.MembersImage.trim()
            : "",
        MemberPosition:
          typeof member?.MemberPosition === "string"
            ? member.MemberPosition.trim()
            : "",
        MemberDescription:
          typeof member?.MemberDescription === "string"
            ? member.MemberDescription.trim()
            : "",
      }))
      .filter(
        (member) =>
          member.MembersImage ||
          member.MemberPosition ||
          member.MemberDescription,
      );

    if (!members.length) {
      return [{ ...base, ...createEmptyAboutMember() }];
    }

    return members.map((member) => ({ ...base, ...member }));
  }, [aboutForm]);

  const handleDeleteCurrent = useCallback(async () => {
    if (!databases) {
      setError("Appwrite client is not configured.");
      return;
    }

    if (!config.databaseId || !collectionId) {
      setError("Missing database or collection ID.");
      return;
    }

    const hasDeletableData =
      activeSection === "about" ? aboutRecordIds.length > 0 : !!documentId;

    if (!hasDeletableData) {
      setStatus("No current document to delete.");
      return;
    }

    const confirmed = window.confirm(
      activeSection === "about"
        ? "Delete all About member records? This action cannot be undone."
        : "Delete current document? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setStatus("Deleting current document...");

      if (activeSection === "about") {
        await Promise.all(
          aboutRecordIds.map((id) =>
            databases.deleteDocument(config.databaseId, collectionId, id),
          ),
        );
      } else if (activeSection === "programs") {
        await databases.deleteDocument(
          config.databaseId,
          collectionId,
          documentId,
        );

        const remainingPrograms = programs.filter(
          (item) => item.$id !== documentId,
        );
        setPrograms(remainingPrograms);

        if (remainingPrograms.length) {
          const nextDoc = remainingPrograms[0];
          const cleanDoc = sanitizeDocument(nextDoc);
          setDocumentId(nextDoc.$id);
          setEditorValue(JSON.stringify(cleanDoc, null, 2));
          setProgramForm(mapProgramDocToForm(cleanDoc));
          setStatus("Program deleted. Loaded next record.");
        } else {
          setDocumentId("");
          setEditorValue("{}");
          setProgramForm(createEmptyProgramForm());
          setStatus("Program deleted. No records remaining.");
        }

        return;
      } else if (activeSection === "testimonials") {
        await databases.deleteDocument(
          config.databaseId,
          collectionId,
          documentId,
        );

        const remainingTestimonials = testimonials.filter(
          (item) => item.$id !== documentId,
        );
        setTestimonials(remainingTestimonials);

        if (remainingTestimonials.length) {
          const nextDoc = remainingTestimonials[0];
          const cleanDoc = sanitizeDocument(nextDoc);
          setDocumentId(nextDoc.$id);
          setEditorValue(JSON.stringify(cleanDoc, null, 2));
          setTestimonialForm(mapTestimonialDocToForm(cleanDoc));
          setStatus("Testimonial deleted. Loaded next record.");
        } else {
          setDocumentId("");
          setEditorValue("{}");
          setTestimonialForm(createEmptyTestimonialForm());
          setStatus("Testimonial deleted. No records remaining.");
        }

        return;
      } else if (activeSection === "responses") {
        await databases.deleteDocument(
          config.databaseId,
          collectionId,
          documentId,
        );

        const remainingResponses = contactResponses.filter(
          (response) => response.$id !== documentId,
        );
        setContactResponses(remainingResponses);

        if (remainingResponses.length) {
          const nextDoc = remainingResponses[0];
          setDocumentId(nextDoc.$id);
          setEditorValue(JSON.stringify(sanitizeDocument(nextDoc), null, 2));
          setStatus("Contact response deleted. Loaded next response.");
        } else {
          setDocumentId("");
          setEditorValue("{}");
          setStatus("Contact response deleted. No responses remaining.");
        }

        return;
      } else if (activeSection === "partnerResponses") {
        await databases.deleteDocument(
          config.databaseId,
          collectionId,
          documentId,
        );

        const remainingPartnerResponses = partnerResponses.filter(
          (response) => response.$id !== documentId,
        );
        setPartnerResponses(remainingPartnerResponses);

        if (remainingPartnerResponses.length) {
          const nextDoc = remainingPartnerResponses[0];
          setDocumentId(nextDoc.$id);
          setEditorValue(JSON.stringify(sanitizeDocument(nextDoc), null, 2));
          setStatus("Partner request deleted. Loaded next request.");
        } else {
          setDocumentId("");
          setEditorValue("{}");
          setStatus("Partner request deleted. No requests remaining.");
        }

        return;
      } else if (activeSection === "blog") {
        await databases.deleteDocument(
          config.databaseId,
          collectionId,
          documentId,
        );

        const remainingPosts = blogPosts.filter(
          (post) => post.$id !== documentId,
        );
        setBlogPosts(remainingPosts);

        if (remainingPosts.length) {
          const nextDoc = remainingPosts[0];
          const cleanDoc = sanitizeDocument(nextDoc);
          setDocumentId(nextDoc.$id);
          setEditorValue(JSON.stringify(cleanDoc, null, 2));
          setBlogForm(mapBlogDocToForm(cleanDoc));
          setStatus("Blog deleted. Loaded next post.");
        } else {
          setDocumentId("");
          setEditorValue("{}");
          setBlogForm(createEmptyBlogForm());
          setStatus("Blog deleted. No posts remaining.");
        }

        return;
      } else {
        await databases.deleteDocument(
          config.databaseId,
          collectionId,
          documentId,
        );
      }

      setDocumentId("");
      setAboutRecordIds([]);
      setEditorValue("{}");
      setHomeForm(emptyHomeForm);
      setAboutForm(createEmptyAboutForm());
      setGalleryForm(createEmptyGalleryForm());
      setBlogForm(createEmptyBlogForm());
      setBlogPosts([]);
      setProgramForm(createEmptyProgramForm());
      setPrograms([]);
      setTestimonialForm(createEmptyTestimonialForm());
      setTestimonials([]);
      setContactResponses([]);
      setPartnerResponses([]);
      setStatus(
        activeSection === "about"
          ? "All About member records deleted."
          : "Current document deleted.",
      );
    } catch (deleteError) {
      setError(deleteError?.message || "Delete failed.");
      setStatus("Delete failed.");
    }
  }, [
    activeSection,
    aboutRecordIds,
    collectionId,
    config.databaseId,
    databases,
    documentId,
    blogPosts,
    programs,
    testimonials,
    contactResponses,
    partnerResponses,
    mapBlogDocToForm,
    mapProgramDocToForm,
    mapTestimonialDocToForm,
  ]);

  const handleSave = useCallback(async () => {
    if (!databases) {
      setError("Appwrite client is not configured.");
      return;
    }

    if (!config.databaseId || !collectionId) {
      setError("Missing database or collection ID.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setStatus("Saving changes...");

      if (
        activeSection === "responses" ||
        activeSection === "partnerResponses"
      ) {
        setStatus(
          "Responses are read-only. Use Delete Current to remove a response.",
        );
        return;
      }

      if (activeSection === "about") {
        const aboutPayloads = getAboutPayloads();

        if (replaceOnSave && aboutRecordIds.length) {
          await Promise.all(
            aboutRecordIds.map((id) =>
              databases.deleteDocument(config.databaseId, collectionId, id),
            ),
          );
        }

        const nextIds = replaceOnSave ? [] : [...aboutRecordIds];

        for (let index = 0; index < aboutPayloads.length; index += 1) {
          const payload = aboutPayloads[index];

          if (!replaceOnSave && nextIds[index]) {
            await databases.updateDocument(
              config.databaseId,
              collectionId,
              nextIds[index],
              payload,
            );
          } else {
            const created = await databases.createDocument(
              config.databaseId,
              collectionId,
              ID.unique(),
              payload,
            );
            nextIds[index] = created.$id;
          }
        }

        if (!replaceOnSave && nextIds.length > aboutPayloads.length) {
          const idsToDelete = nextIds.slice(aboutPayloads.length);
          await Promise.all(
            idsToDelete.map((id) =>
              databases.deleteDocument(config.databaseId, collectionId, id),
            ),
          );
          nextIds.splice(aboutPayloads.length);
        }

        setAboutRecordIds(nextIds);
        setDocumentId(nextIds[0] || "");
        setStatus(
          `Saved ${aboutPayloads.length} member record(s) successfully.`,
        );
        return;
      }

      if (activeSection === "blog") {
        const blogPayload = getBlogPayload();

        if (!blogPayload.title || !blogPayload.author || !blogPayload.content) {
          setError("Title, author, and content are required for blog posts.");
          setStatus("Save failed.");
          return;
        }

        if (documentId && !replaceOnSave) {
          await databases.updateDocument(
            config.databaseId,
            collectionId,
            documentId,
            blogPayload,
          );

          setBlogPosts((prev) =>
            prev.map((post) =>
              post.$id === documentId ? { ...post, ...blogPayload } : post,
            ),
          );
          setStatus("Blog post updated successfully.");
        } else {
          if (documentId && replaceOnSave) {
            await databases.deleteDocument(
              config.databaseId,
              collectionId,
              documentId,
            );
          }

          const created = await databases.createDocument(
            config.databaseId,
            collectionId,
            ID.unique(),
            blogPayload,
          );

          setDocumentId(created.$id);
          setBlogPosts((prev) => [
            created,
            ...prev.filter((p) => p.$id !== documentId),
          ]);
          setStatus("New blog post created successfully.");
        }

        return;
      }

      if (activeSection === "programs") {
        const programPayload = getProgramPayload();

        if (
          !programPayload.title ||
          !programPayload.image ||
          !programPayload.mainText ||
          !programPayload.importantPoints.length
        ) {
          setError(
            "Title, image, main text, and at least one important point are required.",
          );
          setStatus("Save failed.");
          return;
        }

        if (documentId && !replaceOnSave) {
          await databases.updateDocument(
            config.databaseId,
            collectionId,
            documentId,
            programPayload,
          );

          setPrograms((prev) =>
            prev.map((item) =>
              item.$id === documentId ? { ...item, ...programPayload } : item,
            ),
          );
          setStatus("Program updated successfully.");
        } else {
          if (documentId && replaceOnSave) {
            await databases.deleteDocument(
              config.databaseId,
              collectionId,
              documentId,
            );
          }

          const created = await databases.createDocument(
            config.databaseId,
            collectionId,
            ID.unique(),
            programPayload,
          );

          setDocumentId(created.$id);
          setPrograms((prev) => [
            created,
            ...prev.filter((item) => item.$id !== documentId),
          ]);
          setStatus("New program created successfully.");
        }

        return;
      }

      if (activeSection === "testimonials") {
        const testimonialPayload = getTestimonialPayload();

        if (
          !testimonialPayload.name ||
          !testimonialPayload.image ||
          !testimonialPayload.text
        ) {
          setError(
            "Name, YouTube video URL, and testimonial text are required.",
          );
          setStatus("Save failed.");
          return;
        }

        if (!extractYouTubeVideoId(testimonialPayload.image)) {
          setError("Enter a valid YouTube video URL.");
          setStatus("Save failed.");
          return;
        }

        if (documentId && !replaceOnSave) {
          await databases.updateDocument(
            config.databaseId,
            collectionId,
            documentId,
            testimonialPayload,
          );

          setTestimonials((prev) =>
            prev.map((item) =>
              item.$id === documentId
                ? { ...item, ...testimonialPayload }
                : item,
            ),
          );
          setStatus("Testimonial updated successfully.");
        } else {
          if (documentId && replaceOnSave) {
            await databases.deleteDocument(
              config.databaseId,
              collectionId,
              documentId,
            );
          }

          const created = await databases.createDocument(
            config.databaseId,
            collectionId,
            ID.unique(),
            testimonialPayload,
          );

          setDocumentId(created.$id);
          setTestimonials((prev) => [
            created,
            ...prev.filter((item) => item.$id !== documentId),
          ]);
          setStatus("New testimonial created successfully.");
        }

        return;
      }

      const parsed =
        activeSection === "home"
          ? homeForm
          : activeSection === "gallery"
            ? getGalleryPayload()
            : JSON.parse(editorValue);

      if (documentId) {
        if (replaceOnSave) {
          await databases.deleteDocument(
            config.databaseId,
            collectionId,
            documentId,
          );

          const created = await databases.createDocument(
            config.databaseId,
            collectionId,
            ID.unique(),
            parsed,
          );
          setDocumentId(created.$id);
          setStatus("Replaced existing document successfully.");
        } else {
          await databases.updateDocument(
            config.databaseId,
            collectionId,
            documentId,
            parsed,
          );
          setStatus("Saved successfully.");
        }
      } else {
        const created = await databases.createDocument(
          config.databaseId,
          collectionId,
          ID.unique(),
          parsed,
        );
        setDocumentId(created.$id);
        setStatus("Saved successfully.");
      }
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Save failed. Please check JSON format and permissions.",
      );
      setStatus("Save failed.");
    } finally {
      setIsSaving(false);
    }
  }, [
    activeSection,
    collectionId,
    config.databaseId,
    databases,
    documentId,
    editorValue,
    homeForm,
    getAboutPayloads,
    getGalleryPayload,
    getBlogPayload,
    getProgramPayload,
    getTestimonialPayload,
    aboutRecordIds,
    replaceOnSave,
  ]);

  useEffect(() => {
    if (!isConfigMissing) {
      handleLoad();
    }
  }, [handleLoad, isConfigMissing]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin-auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin-login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f3faf5] via-[#f8faf8] to-[#edf3ef] text-[#1d2238]">
      <div className="mx-auto flex w-full max-w-350 flex-col px-4 py-6 md:px-8 lg:flex-row lg:gap-6 lg:px-10">
        <aside className="rounded-4xl border border-[#63c37a2b] bg-white/95 p-5 shadow-[0_18px_40px_rgba(17,24,39,0.08)] backdrop-blur-sm lg:sticky lg:top-6 lg:h-fit lg:w-76">
          <p className="inline-flex rounded-full border border-[#63c37a3d] bg-[#63c37a14] px-3 py-1 text-xs font-bold tracking-[0.16em] text-[#4a945c] uppercase">
            CMS Dashboard
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#1d2238]">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5f6879]">
            Manage page content from Appwrite.
          </p>

          <nav className="mt-6 space-y-2.5">
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => {
                  setActiveSection(section.key);
                  setEditorValue("{}");
                  setHomeForm(emptyHomeForm);
                  setAboutForm(createEmptyAboutForm());
                  setGalleryForm(createEmptyGalleryForm());
                  setBlogForm(createEmptyBlogForm());
                  setBlogPosts([]);
                  setProgramForm(createEmptyProgramForm());
                  setPrograms([]);
                  setTestimonialForm(createEmptyTestimonialForm());
                  setTestimonials([]);
                  setContactResponses([]);
                  setPartnerResponses([]);
                  setAboutRecordIds([]);
                  setDocumentId("");
                  setReplaceOnSave(false);
                  setStatus("Ready");
                  setError("");
                }}
                className={`w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 ${
                  activeSection === section.key
                    ? "border-[#63c37a] bg-[#63c37a] text-white shadow-[0_8px_18px_rgba(99,195,122,0.35)]"
                    : "border-[#e4ebee] bg-[#f8fbfa] text-[#576076] hover:border-[#63c37a59] hover:bg-[#eef8f0]"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="mt-5 flex-1 rounded-4xl border border-[#63c37a2b] bg-white/95 p-5 shadow-[0_18px_40px_rgba(17,24,39,0.08)] backdrop-blur-sm md:p-7 lg:mt-0">
          <div className="mb-5 rounded-3xl border border-[#63c37a1f] bg-linear-to-r from-[#63c37a12] via-white to-[#63c37a0d] px-5 py-4">
            <p className="text-xs font-bold tracking-[0.18em] text-[#4a945c] uppercase">
              Content Manager
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-[#1d2238]">
              {sections.find((section) => section.key === activeSection)?.label}
            </h2>
            <p className="mt-1 text-sm text-[#5f6879]">
              Edit, upload, replace, and publish section content.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#5f6879]">
                Quick actions
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#d6dfd7] bg-white px-5 text-sm font-semibold text-[#4f596e] transition-colors hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoggingOut ? "Signing out..." : "Logout"}
              </button>
              {!isResponsesSection && (
                <label className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe8df] bg-[#f7fbf8] px-3.5 text-xs font-semibold text-[#4f596e]">
                  <input
                    type="checkbox"
                    checked={replaceOnSave}
                    onChange={(event) => setReplaceOnSave(event.target.checked)}
                    className="h-4 w-4 accent-[#63c37a]"
                  />
                  Replace existing on save
                </label>
              )}
              {!isResponsesSection && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isConfigMissing}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#63c37a] px-6 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(99,195,122,0.32)] transition-all hover:-translate-y-px hover:bg-[#459557] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              )}
              {showDeleteAction && (
                <button
                  type="button"
                  onClick={handleDeleteCurrent}
                  disabled={
                    (activeSection === "about"
                      ? !aboutRecordIds.length
                      : !documentId) ||
                    isLoading ||
                    isSaving ||
                    isConfigMissing
                  }
                  className="inline-flex h-10 items-center justify-center rounded-full border border-rose-300 bg-white px-5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete Current
                </button>
              )}
            </div>
          </div>

          {isConfigMissing && (
            <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Appwrite config is incomplete. Add all required values in your
              .env.local.
            </div>
          )}

          {(activeSection === "home" ||
            activeSection === "about" ||
            activeSection === "gallery" ||
            activeSection === "programs" ||
            activeSection === "blog") &&
            isCloudinaryConfigMissing && (
              <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Cloudinary config is incomplete. Add
                NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
                NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.
              </div>
            )}

          {error && (
            <div className="mt-5 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-[#dfe8df] bg-[#f7fbf8] px-4 py-3 text-sm font-medium text-[#4f596e]">
            {status}
          </div>

          {activeSection === "home" ? (
            <div className="mt-6 space-y-5">
              <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                Home Page Content
              </h3>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {homeImageFields.map((field) => (
                  <div
                    key={field.key}
                    className="group rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
                  >
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      {field.label}
                    </label>

                    <input
                      type="url"
                      value={homeForm[field.key] || ""}
                      onChange={(event) =>
                        handleHomeInputChange(field.key, event.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#63c37a] bg-white px-4 text-xs font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleFileUpload(field.key, event.target.files?.[0])
                          }
                        />
                        {uploadingField === field.key
                          ? "Uploading..."
                          : "Upload from device"}
                      </label>
                      <button
                        type="button"
                        onClick={() => clearHomeField(field.key)}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear
                      </button>
                    </div>

                    {homeForm[field.key] && (
                      <img
                        src={homeForm[field.key]}
                        alt={field.label}
                        className="mt-3 h-28 w-full rounded-2xl object-cover ring-1 ring-[#0000000f]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {homeTextFields.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-[#1d2238]">
                        {field.label}
                      </label>
                      <button
                        type="button"
                        onClick={() => clearHomeField(field.key)}
                        className="inline-flex h-8 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear
                      </button>
                    </div>

                    <textarea
                      value={homeForm[field.key] || ""}
                      onChange={(event) =>
                        handleHomeInputChange(field.key, event.target.value)
                      }
                      placeholder="Enter text..."
                      className="min-h-30 w-full rounded-2xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      spellCheck={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === "about" ? (
            <div className="mt-6 space-y-5">
              <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                About Us Content
              </h3>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {aboutImageFields.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
                  >
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      {field.label}
                    </label>

                    <input
                      type="url"
                      value={aboutForm[field.key] || ""}
                      onChange={(event) =>
                        handleAboutInputChange(field.key, event.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#63c37a] bg-white px-4 text-xs font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleAboutImageUpload(
                              field.key,
                              event.target.files?.[0],
                            )
                          }
                        />
                        {uploadingField === `about-${field.key}`
                          ? "Uploading..."
                          : "Upload from device"}
                      </label>
                      <button
                        type="button"
                        onClick={() => clearAboutField(field.key)}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear
                      </button>
                    </div>

                    {aboutForm[field.key] && (
                      <img
                        src={aboutForm[field.key]}
                        alt={field.label}
                        className="mt-3 h-28 w-full rounded-2xl object-cover ring-1 ring-[#0000000f]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-sm font-semibold text-[#1d2238]">
                    Members
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={addAboutMemberField}
                      className="inline-flex h-8 items-center justify-center rounded-full border border-[#63c37a] bg-white px-3 text-xs font-semibold text-[#63c37a] hover:bg-[#63c37a] hover:text-white"
                    >
                      Add member
                    </button>
                    <button
                      type="button"
                      onClick={clearAboutMembers}
                      className="inline-flex h-8 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {(aboutForm.Members || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                    No members added yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(aboutForm.Members || []).map((member, index) => (
                      <div
                        key={`member-image-${index}`}
                        className="rounded-2xl border border-[#dbe3e7] bg-white p-3"
                      >
                        <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                          Member {index + 1}
                        </p>
                        <input
                          type="url"
                          value={member?.MembersImage || ""}
                          onChange={(event) =>
                            handleAboutMemberChange(
                              index,
                              "MembersImage",
                              event.target.value,
                            )
                          }
                          placeholder="Member image URL"
                          className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                        />

                        <input
                          type="text"
                          value={member?.MemberPosition || ""}
                          onChange={(event) =>
                            handleAboutMemberChange(
                              index,
                              "MemberPosition",
                              event.target.value,
                            )
                          }
                          placeholder="Member position"
                          className="mt-3 w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                        />

                        <textarea
                          value={member?.MemberDescription || ""}
                          onChange={(event) =>
                            handleAboutMemberChange(
                              index,
                              "MemberDescription",
                              event.target.value,
                            )
                          }
                          placeholder="Member description"
                          className="mt-3 min-h-24 w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                        />

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <label className="inline-flex h-8 cursor-pointer items-center justify-center rounded-full border border-[#63c37a] bg-white px-3 text-xs font-semibold text-[#63c37a] hover:bg-[#63c37a] hover:text-white">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) =>
                                handleAboutMemberImageUpload(
                                  index,
                                  event.target.files?.[0],
                                )
                              }
                            />
                            {uploadingField === `about-member-${index}`
                              ? "Uploading..."
                              : "Upload"}
                          </label>
                          <button
                            type="button"
                            onClick={() => removeAboutMemberField(index)}
                            disabled={(aboutForm.Members || []).length <= 1}
                            className="inline-flex h-8 items-center justify-center rounded-full border border-rose-300 bg-white px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>

                        {member?.MembersImage && (
                          <img
                            src={member.MembersImage}
                            alt={`Member ${index + 1}`}
                            className="mt-3 h-24 w-full rounded-2xl object-cover ring-1 ring-[#0000000f]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {aboutTextFields.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-[#1d2238]">
                        {field.label}
                      </label>
                      <button
                        type="button"
                        onClick={() => clearAboutField(field.key)}
                        className="inline-flex h-8 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear
                      </button>
                    </div>

                    <textarea
                      value={aboutForm[field.key] || ""}
                      onChange={(event) =>
                        handleAboutInputChange(field.key, event.target.value)
                      }
                      placeholder="Enter text..."
                      className="min-h-34 w-full rounded-2xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      spellCheck={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === "gallery" ? (
            <div className="mt-6 space-y-5">
              <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                Gallery Content
              </h3>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {galleryFields.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <label className="text-sm font-semibold text-[#1d2238]">
                        {field.label}
                      </label>
                      <span className="rounded-full border border-[#dfe8df] bg-white px-2.5 py-1 text-xs font-semibold text-[#5f6879]">
                        {(galleryForm[field.key] || []).length} image(s)
                      </span>
                    </div>

                    <div
                      className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white p-3 text-center"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        handleGalleryFilesUpload(
                          field.key,
                          event.dataTransfer.files,
                        );
                      }}
                    >
                      <p className="text-sm text-[#5f6879]">
                        Drop images here or use upload button
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#63c37a] bg-white px-4 text-xs font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) =>
                            handleGalleryFilesUpload(
                              field.key,
                              event.target.files,
                            )
                          }
                        />
                        {uploadingField === `gallery-${field.key}`
                          ? "Uploading..."
                          : "Upload files"}
                      </label>
                      <button
                        type="button"
                        onClick={() => clearGalleryField(field.key)}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear category
                      </button>
                    </div>

                    {(galleryForm[field.key] || []).length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {(galleryForm[field.key] || []).map(
                          (imageUrl, index) => (
                            <div
                              key={`${field.key}-${index}`}
                              className="relative overflow-hidden rounded-xl border border-[#e2e8ef] bg-white"
                            >
                              <img
                                src={imageUrl}
                                alt={`${field.label} ${index + 1}`}
                                className="h-24 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeGalleryImage(field.key, index)
                                }
                                className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white hover:bg-rose-600"
                              >
                                ×
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === "blog" ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                  Blog Content Studio
                </h3>
                <button
                  type="button"
                  onClick={handleCreateNewBlog}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#63c37a] bg-white px-5 text-sm font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white"
                >
                  + Create New Blog
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1d2238]">
                      Existing Posts
                    </p>
                    <span className="rounded-full border border-[#dfe8df] bg-white px-2.5 py-1 text-xs font-semibold text-[#5f6879]">
                      {blogPosts.length}
                    </span>
                  </div>

                  <div className="max-h-135 space-y-2 overflow-auto pr-1">
                    {blogPosts.length ? (
                      blogPosts.map((post) => {
                        const isActive = post.$id === documentId;
                        const postTitle =
                          typeof post.title === "string" && post.title.trim()
                            ? post.title
                            : "Untitled Post";
                        const postAuthor =
                          typeof post.author === "string" ? post.author : "";
                        return (
                          <button
                            key={post.$id}
                            type="button"
                            onClick={() => handleSelectBlogPost(post)}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-[#63c37a] bg-[#eff9f1]"
                                : "border-[#e4ebee] bg-white hover:bg-[#f8fbfa]"
                            }`}
                          >
                            <p className="line-clamp-2 text-sm font-semibold text-[#1d2238]">
                              {postTitle}
                            </p>
                            <p className="mt-1 text-xs text-[#5f6879]">
                              {postAuthor || "Unknown author"}
                            </p>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                        No blog posts yet. Create your first one.
                      </div>
                    )}
                  </div>
                </aside>

                <section className="space-y-4 rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                        Title
                      </label>
                      <input
                        type="text"
                        value={blogForm.title}
                        onChange={(event) =>
                          handleBlogInputChange("title", event.target.value)
                        }
                        placeholder="Enter blog title"
                        className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                        Author
                      </label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(event) =>
                          handleBlogInputChange("author", event.target.value)
                        }
                        placeholder="Author name"
                        className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                        Publish Date
                      </label>
                      <input
                        type="datetime-local"
                        value={blogForm.publishedDate}
                        onChange={(event) =>
                          handleBlogInputChange(
                            "publishedDate",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                        Tag (enum value)
                      </label>
                      <input
                        type="text"
                        value={blogForm.tags}
                        onChange={(event) =>
                          handleBlogInputChange("tags", event.target.value)
                        }
                        placeholder="Enter exact tag enum value"
                        className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Main Image
                    </label>
                    <input
                      type="url"
                      value={blogForm.mainImage}
                      onChange={(event) =>
                        handleBlogInputChange("mainImage", event.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#63c37a] bg-white px-4 text-xs font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleBlogImageUpload(event.target.files?.[0])
                          }
                        />
                        {uploadingField === "blog-mainImage"
                          ? "Uploading..."
                          : "Upload featured image"}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleBlogInputChange("mainImage", "")}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear
                      </button>
                    </div>

                    {blogForm.mainImage && (
                      <img
                        src={blogForm.mainImage}
                        alt="Blog main"
                        className="mt-3 h-40 w-full rounded-2xl object-cover ring-1 ring-[#0000000f]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Content
                    </label>
                    <textarea
                      value={blogForm.content}
                      onChange={(event) =>
                        handleBlogInputChange("content", event.target.value)
                      }
                      placeholder="Write blog content..."
                      className="min-h-64 w-full rounded-2xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      spellCheck={false}
                    />
                  </div>
                </section>
              </div>
            </div>
          ) : activeSection === "programs" ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                  Programs Page Manager
                </h3>
                <button
                  type="button"
                  onClick={handleCreateNewProgram}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#63c37a] bg-white px-5 text-sm font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white"
                >
                  + Create New Program
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1d2238]">
                      Existing Programs
                    </p>
                    <span className="rounded-full border border-[#dfe8df] bg-white px-2.5 py-1 text-xs font-semibold text-[#5f6879]">
                      {programs.length}
                    </span>
                  </div>

                  <div className="max-h-135 space-y-2 overflow-auto pr-1">
                    {programs.length ? (
                      programs.map((item) => {
                        const isActive = item.$id === documentId;
                        const programTitle =
                          typeof item.title === "string" && item.title.trim()
                            ? item.title
                            : "Untitled Program";

                        return (
                          <button
                            key={item.$id}
                            type="button"
                            onClick={() => handleSelectProgram(item)}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-[#63c37a] bg-[#eff9f1]"
                                : "border-[#e4ebee] bg-white hover:bg-[#f8fbfa]"
                            }`}
                          >
                            <p className="line-clamp-2 text-sm font-semibold text-[#1d2238]">
                              {programTitle}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-[#5f6879]">
                              {item.mainText || "No description"}
                            </p>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                        No programs yet. Create your first one.
                      </div>
                    )}
                  </div>
                </aside>

                <section className="space-y-4 rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Program Title
                    </label>
                    <input
                      type="text"
                      value={programForm.title}
                      onChange={(event) =>
                        handleProgramInputChange("title", event.target.value)
                      }
                      placeholder="Enter program title"
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Program Image URL
                    </label>
                    <input
                      type="url"
                      value={programForm.image}
                      onChange={(event) =>
                        handleProgramInputChange("image", event.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#63c37a] bg-white px-4 text-xs font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleProgramImageUpload(event.target.files?.[0])
                          }
                        />
                        {uploadingField === "program-image"
                          ? "Uploading..."
                          : "Upload image"}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleProgramInputChange("image", "")}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Clear
                      </button>
                    </div>

                    {programForm.image && (
                      <img
                        src={programForm.image}
                        alt="Program"
                        className="mt-3 h-40 w-full rounded-2xl object-cover ring-1 ring-[#0000000f]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Main Text
                    </label>
                    <textarea
                      value={programForm.mainText}
                      onChange={(event) =>
                        handleProgramInputChange("mainText", event.target.value)
                      }
                      placeholder="Program description"
                      className="min-h-36 w-full rounded-2xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      spellCheck={false}
                    />
                  </div>

                  <div className="rounded-2xl border border-[#dbe3e7] bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <label className="block text-sm font-semibold text-[#1d2238]">
                        Important Points
                      </label>
                      <button
                        type="button"
                        onClick={addProgramPointField}
                        className="inline-flex h-8 items-center justify-center rounded-full border border-[#63c37a] bg-white px-3 text-xs font-semibold text-[#63c37a] hover:bg-[#63c37a] hover:text-white"
                      >
                        Add point
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(programForm.importantPoints || []).map(
                        (point, index) => (
                          <div
                            key={`program-point-${index}`}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={point}
                              onChange={(event) =>
                                handleProgramPointChange(
                                  index,
                                  event.target.value,
                                )
                              }
                              placeholder={`Important point ${index + 1}`}
                              className="flex-1 rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                            />
                            <button
                              type="button"
                              onClick={() => removeProgramPointField(index)}
                              disabled={
                                (programForm.importantPoints || []).length <= 1
                              }
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-300 bg-white px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : activeSection === "testimonials" ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                  Testimonials Manager
                </h3>
                <button
                  type="button"
                  onClick={handleCreateNewTestimonial}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#63c37a] bg-white px-5 text-sm font-semibold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white"
                >
                  + Create New Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1d2238]">
                      Existing Testimonials
                    </p>
                    <span className="rounded-full border border-[#dfe8df] bg-white px-2.5 py-1 text-xs font-semibold text-[#5f6879]">
                      {testimonials.length}
                    </span>
                  </div>

                  <div className="max-h-135 space-y-2 overflow-auto pr-1">
                    {testimonials.length ? (
                      testimonials.map((item) => {
                        const isActive = item.$id === documentId;
                        const testimonialName =
                          typeof item.name === "string" && item.name.trim()
                            ? item.name
                            : "Unnamed";

                        return (
                          <button
                            key={item.$id}
                            type="button"
                            onClick={() => handleSelectTestimonial(item)}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-[#63c37a] bg-[#eff9f1]"
                                : "border-[#e4ebee] bg-white hover:bg-[#f8fbfa]"
                            }`}
                          >
                            <p className="line-clamp-1 text-sm font-semibold text-[#1d2238]">
                              {testimonialName}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-[#5f6879]">
                              {item.text || "No testimonial text"}
                            </p>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                        No testimonials yet. Create your first one.
                      </div>
                    )}
                  </div>
                </aside>

                <section className="space-y-4 rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={testimonialForm.name}
                      onChange={(event) =>
                        handleTestimonialInputChange("name", event.target.value)
                      }
                      placeholder="Provider name"
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={testimonialForm.image}
                      onChange={(event) =>
                        handleTestimonialInputChange(
                          "image",
                          event.target.value,
                        )
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                    />

                    <p className="mt-2 text-xs text-[#5f6879]">
                      Paste a YouTube watch/share/embed URL.
                    </p>

                    {testimonialForm.image &&
                      extractYouTubeVideoId(testimonialForm.image) && (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-[#dbe3e7] bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(testimonialForm.image)}`}
                            title="Testimonial video preview"
                            className="aspect-video w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                      )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Testimonial Text
                    </label>
                    <textarea
                      value={testimonialForm.text}
                      onChange={(event) =>
                        handleTestimonialInputChange("text", event.target.value)
                      }
                      placeholder="What they said about the foundation..."
                      className="min-h-40 w-full rounded-2xl border border-[#dbe3e7] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                      spellCheck={false}
                    />
                  </div>
                </section>
              </div>
            </div>
          ) : activeSection === "responses" ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                  Contact Us Requests
                </h3>
                <span className="rounded-full border border-[#dfe8df] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f6879]">
                  {contactResponses.length} response(s)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <p className="mb-3 text-sm font-semibold text-[#1d2238]">
                    Incoming Requests
                  </p>

                  <div className="max-h-135 space-y-2 overflow-auto pr-1">
                    {contactResponses.length ? (
                      contactResponses.map((response, index) => {
                        const isActive = response.$id === documentId;
                        const fullName =
                          typeof response.fullName === "string"
                            ? response.fullName
                            : typeof response.name === "string"
                              ? response.name
                              : "Unknown";

                        return (
                          <button
                            key={response.$id}
                            type="button"
                            onClick={() => {
                              setDocumentId(response.$id);
                              setStatus(
                                `Viewing contact response ${index + 1} of ${contactResponses.length}.`,
                              );
                            }}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-[#63c37a] bg-[#eff9f1]"
                                : "border-[#e4ebee] bg-white hover:bg-[#f8fbfa]"
                            }`}
                          >
                            <p className="line-clamp-1 text-sm font-semibold text-[#1d2238]">
                              {fullName}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-[#5f6879]">
                              {response.subject || "No subject"}
                            </p>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                        No contact requests yet.
                      </div>
                    )}
                  </div>
                </aside>

                <section className="space-y-4 rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  {selectedContactResponse ? (
                    <>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Full Name
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#1d2238]">
                            {selectedContactResponse.fullName ||
                              selectedContactResponse.name ||
                              "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Email
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedContactResponse.email || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Phone Number
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedContactResponse.phoneNo ||
                              selectedContactResponse.phone ||
                              "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Received At
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedContactResponse.$createdAt
                              ? new Date(
                                  selectedContactResponse.$createdAt,
                                ).toLocaleString()
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                          Subject
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#1d2238]">
                          {selectedContactResponse.subject || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                          Message
                        </p>
                        <p className="mt-2 rounded-2xl border border-[#dbe3e7] bg-white px-4 py-3 text-sm leading-relaxed text-[#1d2238]">
                          {selectedContactResponse.message || "-"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                      Select a response to view details.
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : activeSection === "partnerResponses" ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                  Partner With Us Requests
                </h3>
                <span className="rounded-full border border-[#dfe8df] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f6879]">
                  {partnerResponses.length} request(s)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <p className="mb-3 text-sm font-semibold text-[#1d2238]">
                    Incoming Requests
                  </p>

                  <div className="max-h-135 space-y-2 overflow-auto pr-1">
                    {partnerResponses.length ? (
                      partnerResponses.map((response, index) => {
                        const isActive = response.$id === documentId;
                        const fullName =
                          typeof response.name === "string"
                            ? response.name
                            : "Unknown";

                        return (
                          <button
                            key={response.$id}
                            type="button"
                            onClick={() => {
                              setDocumentId(response.$id);
                              setStatus(
                                `Viewing partner request ${index + 1} of ${partnerResponses.length}.`,
                              );
                            }}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-[#63c37a] bg-[#eff9f1]"
                                : "border-[#e4ebee] bg-white hover:bg-[#f8fbfa]"
                            }`}
                          >
                            <p className="line-clamp-1 text-sm font-semibold text-[#1d2238]">
                              {fullName}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-[#5f6879]">
                              {response.location || "No location"}
                            </p>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                        No partner requests yet.
                      </div>
                    )}
                  </div>
                </aside>

                <section className="space-y-4 rounded-3xl border border-[#dfe8df] bg-linear-to-b from-[#f9fdf9] to-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  {selectedPartnerResponse ? (
                    <>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Full Name
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#1d2238]">
                            {selectedPartnerResponse.name || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Email
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedPartnerResponse.email || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Phone Number
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedPartnerResponse.phoneNo || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Location
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedPartnerResponse.location || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Availability
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedPartnerResponse.availability || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                            Received At
                          </p>
                          <p className="mt-1 text-sm text-[#1d2238]">
                            {selectedPartnerResponse.$createdAt
                              ? new Date(
                                  selectedPartnerResponse.$createdAt,
                                ).toLocaleString()
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6879] uppercase">
                          Skills & Expertise
                        </p>
                        <p className="mt-2 rounded-2xl border border-[#dbe3e7] bg-white px-4 py-3 text-sm leading-relaxed text-[#1d2238]">
                          {selectedPartnerResponse.skills || "-"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                      Select a request to view details.
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                Content JSON (editable)
              </label>
              <textarea
                value={editorValue}
                onChange={(event) => setEditorValue(event.target.value)}
                className="min-h-105 w-full rounded-3xl border border-[#dbe3e7] bg-[#fcfdfc] p-4 font-mono text-sm leading-relaxed text-[#1d2238] outline-none transition-colors focus:border-[#63c37a]"
                spellCheck={false}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
