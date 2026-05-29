export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Task Management API - Kanggo Technical Test",
    version: "1.0.0",
    description:
      "Dokumentasi API lengkap untuk sistem manajemen tugas (Task Management System) menggunakan Express, TypeScript, dan MySQL.",
    contact: {
      name: "Andry Ramadhan",
      email: "andryramdhan58@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5001/api",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Masukkan token JWT Anda dalam format: `Bearer <token>` untuk mengakses endpoint terproteksi.",
      },
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            example: "Andry Ramadhan",
            description: "Nama lengkap user (min 2 karakter, max 100).",
          },
          email: {
            type: "string",
            format: "email",
            example: "example@domain.com",
            description: "Email unik yang valid.",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "password123",
            description: "Password keamanan user (min 6 karakter).",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "example@domain.com",
          },
          password: {
            type: "string",
            example: "password123",
          },
        },
      },
      CreateTaskInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: {
            type: "string",
            example: "Mengerjakan Technical Test",
            description: "Judul tugas (min 3 karakter, max 255).",
          },
          description: {
            type: "string",
            example: "Membuat backend Express TypeScript + MySQL dan Docker.",
            description: "Deskripsi tugas opsional.",
          },
          status: {
            type: "string",
            enum: ["pending", "in-progress", "done"],
            default: "pending",
            example: "in-progress",
          },
          deadline: {
            type: "string",
            format: "date",
            example: "2026-06-05",
            description:
              "Format tanggal: YYYY-MM-DD. Harus berupa tanggal di masa depan (opsional).",
          },
        },
      },
      UpdateTaskInput: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Mengerjakan Technical Test (Revisi)",
          },
          description: {
            type: "string",
            example: "Menambahkan dokumentasi Swagger API.",
          },
          status: {
            type: "string",
            enum: ["pending", "in-progress", "done"],
            example: "done",
          },
          deadline: {
            type: "string",
            format: "date",
            example: "2026-06-10",
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Andry Ramadhan" },
          email: {
            type: "string",
            format: "email",
            example: "example@domain.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-29T06:33:45.334Z",
          },
        },
      },
      TaskResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Mengerjakan Technical Test" },
          description: {
            type: "string",
            nullable: true,
            example: "Membuat backend Express TypeScript.",
          },
          status: {
            type: "string",
            enum: ["pending", "in-progress", "done"],
            example: "in-progress",
          },
          deadline: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2026-06-05T00:00:00.000Z",
          },
          userId: { type: "integer", example: 1 },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-29T06:35:10.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-29T06:35:10.000Z",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Deskripsi pesan error." },
          errors: {
            type: "array",
            nullable: true,
            items: { type: "object" },
            description: "Detail error validasi jika ada.",
          },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Autentikasi"],
        summary: "Register User Baru",
        description: "Mendaftarkan user baru ke sistem.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Registrasi berhasil.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Registrasi berhasil.",
                    },
                    data: {
                      $ref: "#/components/schemas/UserResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal / Email sudah terdaftar.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autentikasi"],
        summary: "Login User",
        description:
          "Melakukan login dengan email dan password untuk mendapatkan token JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login berhasil.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login berhasil." },
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          $ref: "#/components/schemas/UserResponse",
                        },
                        token: {
                          type: "string",
                          example: "eyJhbGciOiJIUzI1NiIsIn...",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Email atau password salah.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        tags: ["Tugas (Tasks)"],
        summary: "Ambil Daftar Tugas",
        description:
          "Mengambil semua daftar tugas milik user yang sedang login. Mendukung pencarian, penyaringan status, dan paginasi.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["pending", "in-progress", "done"],
            },
            description: "Filter tugas berdasarkan status.",
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            description:
              "Cari tugas berdasarkan kata kunci di judul (live search).",
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 1,
            },
            description: "Halaman ke-berapa (untuk pagination).",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 10,
            },
            description: "Jumlah data per halaman.",
          },
        ],
        responses: {
          200: {
            description: "Daftar tugas berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Daftar tugas berhasil diambil.",
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/TaskResponse",
                      },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        totalItems: { type: "integer", example: 25 },
                        itemCount: { type: "integer", example: 10 },
                        itemsPerPage: { type: "integer", example: 10 },
                        totalPages: { type: "integer", example: 3 },
                        currentPage: { type: "integer", example: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Tidak diizinkan (Token JWT tidak valid / hilang).",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tugas (Tasks)"],
        summary: "Buat Tugas Baru",
        description:
          "Membuat tugas baru yang terasosiasi dengan user yang sedang login.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTaskInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Tugas berhasil dibuat.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Tugas berhasil dibuat.",
                    },
                    data: {
                      $ref: "#/components/schemas/TaskResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi input gagal.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Tidak diizinkan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      put: {
        tags: ["Tugas (Tasks)"],
        summary: "Perbarui Tugas",
        description:
          "Memperbarui detail tugas yang ada berdasarkan ID. Hanya pemilik tugas yang bisa memperbarui.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID tugas yang ingin diperbarui.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTaskInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Tugas berhasil diperbarui.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Tugas berhasil diperbarui.",
                    },
                    data: {
                      $ref: "#/components/schemas/TaskResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi input gagal / ID tidak valid.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Tidak diizinkan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description:
              "Akses ditolak (Mencoba mengakses tugas milik orang lain).",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Tugas tidak ditemukan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Tugas (Tasks)"],
        summary: "Hapus Tugas",
        description:
          "Menghapus tugas berdasarkan ID. Hanya pemilik tugas yang bisa menghapus.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID tugas yang ingin dihapus.",
          },
        ],
        responses: {
          200: {
            description: "Tugas berhasil dihapus.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Tugas berhasil dihapus.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "ID tidak valid.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Tidak diizinkan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Akses ditolak.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Tugas tidak ditemukan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};
