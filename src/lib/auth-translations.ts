// Supabase hata mesajlarını Türkçeye çevirir
export function translateAuthError(message: string): string {
    const translations: Record<string, string> = {
        // Şifre hataları
        "Password should be at least 6 characters.": "Şifre en az 6 karakter olmalıdır.",
        "Password should be at least 6 characters": "Şifre en az 6 karakter olmalıdır.",
        "Password is too short": "Şifre çok kısa.",
        "Password is too weak": "Şifre çok zayıf.",

        // Email hataları
        "Unable to validate email address: invalid format": "Geçersiz e-posta formatı.",
        "Invalid email format": "Geçersiz e-posta formatı.",
        "Email address is invalid": "E-posta adresi geçersiz.",
        "A user with this email address has already been registered": "Bu e-posta adresi zaten kayıtlı.",
        "User already registered": "Bu kullanıcı zaten kayıtlı.",
        "Email already registered": "Bu e-posta adresi zaten kayıtlı.",

        // Giriş hataları
        "Invalid login credentials": "E-posta veya şifre hatalı.",
        "Invalid email or password": "E-posta veya şifre hatalı.",
        "Email not confirmed": "E-posta adresiniz henüz onaylanmadı.",

        // Rate limit
        "For security purposes, you can only request this after": "Güvenlik nedeniyle, bir süre sonra tekrar deneyebilirsiniz.",
        "Too many requests": "Çok fazla deneme yapıldı. Lütfen bir süre bekleyin.",
        "Rate limit exceeded": "Çok fazla deneme yapıldı. Lütfen bir süre bekleyin.",

        // Genel hatalar
        "Signup requires a valid password": "Kayıt için geçerli bir şifre gereklidir.",
        "Auth session missing": "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
        "User not found": "Kullanıcı bulunamadı.",
        "Network error": "Ağ hatası. Lütfen internet bağlantınızı kontrol edin.",
    };

    // Exact match
    if (translations[message]) {
        return translations[message];
    }

    // Partial match for messages that contain certain keywords
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("password") && lowerMessage.includes("6 character")) {
        return "Şifre en az 6 karakter olmalıdır.";
    }

    if (lowerMessage.includes("email") && lowerMessage.includes("already")) {
        return "Bu e-posta adresi zaten kayıtlı.";
    }

    if (lowerMessage.includes("invalid login") || lowerMessage.includes("invalid credentials")) {
        return "E-posta veya şifre hatalı.";
    }

    if (lowerMessage.includes("rate limit") || lowerMessage.includes("too many")) {
        return "Çok fazla deneme yapıldı. Lütfen bir süre bekleyin.";
    }

    if (lowerMessage.includes("email not confirmed")) {
        return "E-posta adresiniz henüz onaylanmadı.";
    }

    // Return original if no translation found
    return message;
}
