// frontend-company/src/pages/Company/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    fetchCompany,
    updateCompany,
    createCompany,
    uploadCompanyLogo
} from '../../store/slices/company.slice';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { Card } from '../../components/common/UI/Card';
import { Spinner } from '../../components/common/UI/Spinner';
import { Alert } from '../../components/common/UI/Alert';
import {
    Building2,
    Globe,
    Mail,
    Phone,
    MapPin,
    Users,
    Edit,
    Save,
    X,
    Camera,
    CheckCircle,
    Plus,
    Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';

interface CompanyFormData {
    name: string;
    description: string;
    website: string;
    industryType: string;
    companyType: 'startup' | 'private' | 'public-listed' | 'government' | 'non-profit' | 'educational' | 'self-employed';
    companySize: 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
    foundedYear: number;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    phone: string;
    email: string;
    socialLinks: {
        platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'youtube';
        url: string;
    }[];
}

const initialFormData: CompanyFormData = {
    name: '',
    description: '',
    website: '',
    industryType: '',
    companyType: 'private',
    companySize: 'small',
    foundedYear: 2024,
    location: {
        address: '',
        city: '',
        state: '',
        country: 'USA',
        zipCode: '',
    },
    phone: '',
    email: '',
    socialLinks: [],
};

// Social platform options
const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
];

// Industry types
const industryTypes = [
    { value: 'technology', label: 'فناوری' },
    { value: 'finance', label: 'مالی' },
    { value: 'healthcare', label: 'بهداشت و درمان' },
    { value: 'education', label: 'آموزش' },
    { value: 'retail', label: 'خرده فروشی' },
    { value: 'manufacturing', label: 'تولید' },
    { value: 'construction', label: 'ساخت و ساز' },
    { value: 'transportation', label: 'حمل و نقل' },
    { value: 'hospitality', label: 'مهمان‌نوازی' },
    { value: 'real_estate', label: 'املاک' },
    { value: 'consulting', label: 'مشاوره' },
    { value: 'other', label: 'سایر' },
];

// Company types - Updated with correct enum values
const companyTypes = [
    { value: 'startup', label: 'استارتاپ' },
    { value: 'private', label: 'خصوصی' },
    { value: 'public-listed', label: 'عمومی (سهامی عام)' },
    { value: 'government', label: 'دولتی' },
    { value: 'non-profit', label: 'غیر انتفاعی' },
    { value: 'educational', label: 'آموزشی' },
    { value: 'self-employed', label: 'خود اشتغالی' },
];

// Company sizes
const companySizes = [
    { value: 'micro', label: '۱-۱۰ کارمند' },
    { value: 'small', label: '۱۱-۵۰ کارمند' },
    { value: 'medium', label: '۵۱-۲۰۰ کارمند' },
    { value: 'large', label: '۲۰۱-۱۰۰۰ کارمند' },
    { value: 'enterprise', label: '۱۰۰۰+ کارمند' },
];

const CompanyProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { company, isLoading, isUpdating }: any = useSelector((state: RootState) => state.company);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData]: any = useState<CompanyFormData>(initialFormData);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [newSocialLink, setNewSocialLink] = useState({ platform: 'linkedin' as const, url: '' });

    useEffect(() => {
        const checkCompany = async () => {
            try {
                await dispatch(fetchCompany()).unwrap();
            } catch (error) {
                setIsCreating(true);
                setIsEditing(true);
            }
        };
        checkCompany();
    }, [dispatch]);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || '',
                description: company.description || '',
                website: company.website || '',
                industryType: company.industryType || '',
                companyType: company.companyType || 'private',
                companySize: company.companySize || 'small',
                foundedYear: company.foundedYear || 2024,
                location: company.location || {
                    address: '',
                    city: '',
                    state: '',
                    country: 'USA',
                    zipCode: '',
                },
                phone: company.phone || '',
                email: company.email || '',
                socialLinks: company.socialLinks || [],
            });
            setIsCreating(false);
        }
    }, [company]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: { [x: string]: any; }) => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof CompanyFormData] as any,
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleAddSocialLink = () => {
        if (newSocialLink.url.trim()) {
            setFormData((prev: any) => ({
                ...prev,
                socialLinks: [...prev.socialLinks, { ...newSocialLink }],
            }));
            setNewSocialLink({ platform: 'linkedin', url: '' });
        }
    };

    const handleRemoveSocialLink = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_: any, i: number) => i !== index),
        }));
    };

    const handleSocialLinkChange = (index: number, field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            socialLinks: prev.socialLinks.map((link: any, i: number) =>
                i === index ? { ...link, [field]: value } : link
            ),
        }));
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('نام شرکت الزامی است');
            return;
        }

        try {
            if (isCreating) {
                await dispatch(createCompany(formData)).unwrap();
                toast.success('شرکت با موفقیت ایجاد شد!');
                setIsCreating(false);
            } else {
                await dispatch(updateCompany(formData)).unwrap();
                toast.success('شرکت با موفقیت بروزرسانی شد!');
            }
            setSaveSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            toast.error(error.message || 'ذخیره شرکت با شکست مواجه شد');
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('حجم لوگو باید کمتر از ۵ مگابایت باشد');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            toast.error('لطفاً یک تصویر معتبر آپلود کنید (JPEG، PNG، GIF یا WEBP)');
            return;
        }

        setUploadingLogo(true);
        try {
            await dispatch(uploadCompanyLogo(file)).unwrap();
            toast.success('لوگو با موفقیت آپلود شد!');
        } catch (error: any) {
            toast.error(error.message || 'آپلود لوگو با شکست مواجه شد');
        }
        setUploadingLogo(false);
    };

    const handleCancel = () => {
        if (isCreating) {
            setIsEditing(false);
            setIsCreating(false);
            setFormData(initialFormData);
        } else if (company) {
            setIsEditing(false);
            setFormData({
                name: company.name || '',
                description: company.description || '',
                website: company.website || '',
                industryType: company.industryType || '',
                companyType: company.companyType || 'private',
                companySize: company.companySize || 'small',
                foundedYear: company.foundedYear || 2024,
                location: company.location || {
                    address: '',
                    city: '',
                    state: '',
                    country: 'USA',
                    zipCode: '',
                },
                phone: company.phone || '',
                email: company.email || '',
                socialLinks: company.socialLinks || [],
            });
        }
    };

    if (isLoading && !company && !isCreating) {
        return (
            <div className="flex justify-center items-center h-64" dir="rtl">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!company && !isCreating && !isLoading) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50" dir="rtl">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">پروفایل شرکت وجود ندارد</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                    شما هنوز پروفایل شرکت خود را ایجاد نکرده‌اید. برای شروع ثبت آگهی شغلی، یک پروفایل ایجاد کنید.
                </p>
                <Button
                    className="mt-4 gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => {
                        setIsCreating(true);
                        setIsEditing(true);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    ایجاد پروفایل شرکت
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {isCreating ? 'ایجاد پروفایل شرکت' : 'پروفایل شرکت'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                        {isCreating
                            ? 'پروفایل شرکت خود را برای شروع استخدام تنظیم کنید'
                            : 'اطلاعات و برندینگ شرکت خود را مدیریت کنید'
                        }
                    </p>
                </div>
                {!isCreating && !isEditing && (
                    <Button
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <Edit className="h-4 w-4" />
                        ویرایش پروفایل
                    </Button>
                )}
            </div>

            {/* Success Alert */}
            {saveSuccess && (
                <Alert variant="success" className="animate-fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {isCreating ? 'شرکت با موفقیت ایجاد شد!' : 'پروفایل شرکت با موفقیت بروزرسانی شد!'}
                    </div>
                </Alert>
            )}

            {/* Company Profile Form */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center gap-3 lg:min-w-40">
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                                {company?.logoUrl ? (
                                    <img
                                        src={company.logoUrl}
                                        alt={company.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Building2 className="w-16 h-16 text-gray-400" />
                                )}
                                {(isEditing || isCreating) && (
                                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-white mb-1" />
                                        <span className="text-xs text-white">آپلود لوگو</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {uploadingLogo && (
                                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                                        <Spinner size="lg" color="white" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isEditing || isCreating ? 'برای آپلود لوگو کلیک کنید' : 'لوگوی شرکت'}
                        </p>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1">
                        {(isEditing || isCreating) ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            نام شرکت *
                                        </label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="شرکت آکمی"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            صنعت *
                                        </label>
                                        <select
                                            name="industryType"
                                            value={formData.industryType}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">انتخاب صنعت</option>
                                            {industryTypes.map((industry) => (
                                                <option key={industry.value} value={industry.value}>
                                                    {industry.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            نوع شرکت *
                                        </label>
                                        <select
                                            name="companyType"
                                            value={formData.companyType}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">انتخاب نوع شرکت</option>
                                            {companyTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            تعداد کارمندان *
                                        </label>
                                        <select
                                            name="companySize"
                                            value={formData.companySize}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            {companySizes.map((size) => (
                                                <option key={size.value} value={size.value}>
                                                    {size.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            سال تاسیس
                                        </label>
                                        <Input
                                            name="foundedYear"
                                            type="number"
                                            value={formData.foundedYear}
                                            onChange={handleInputChange}
                                            placeholder="۲۰۲۴"
                                            min="1800"
                                            max="2026"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            ایمیل
                                        </label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="contact@company.com"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            تلفن
                                        </label>
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+98 21 1234 5678"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            وب‌سایت
                                        </label>
                                        <Input
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        موقعیت مکانی
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            name="location.address"
                                            value={formData.location.address}
                                            onChange={handleInputChange}
                                            placeholder="آدرس"
                                            className="col-span-2 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                        <Input
                                            name="location.city"
                                            value={formData.location.city}
                                            onChange={handleInputChange}
                                            placeholder="شهر"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                        <Input
                                            name="location.state"
                                            value={formData.location.state}
                                            onChange={handleInputChange}
                                            placeholder="استان"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                        <Input
                                            name="location.country"
                                            value={formData.location.country}
                                            onChange={handleInputChange}
                                            placeholder="کشور"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                        <Input
                                            name="location.zipCode"
                                            value={formData.location.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="کد پستی"
                                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        توضیحات
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right"
                                        placeholder="درباره شرکت خود به داوطلبان بگویید..."
                                    />
                                </div>

                                {/* Social Links */}
                                <div>
                                    <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        لینک‌های شبکه‌های اجتماعی
                                    </label>
                                    <div className="space-y-2">
                                        {formData.socialLinks.map((link: any, index: number) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <select
                                                    value={link.platform}
                                                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                >
                                                    {socialPlatforms.map((platform) => (
                                                        <option key={platform.value} value={platform.value}>
                                                            {platform.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Input
                                                    value={link.url}
                                                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                                    placeholder="https://..."
                                                    className="flex-2 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveSocialLink(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="flex gap-2">
                                            <select
                                                value={newSocialLink.platform}
                                                onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value as any })}
                                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            >
                                                {socialPlatforms.map((platform) => (
                                                    <option key={platform.value} value={platform.value}>
                                                        {platform.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <Input
                                                value={newSocialLink.url}
                                                onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                                                placeholder="https://..."
                                                className="flex-2 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddSocialLink}
                                                className="shrink-0"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        isLoading={isUpdating}
                                        className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isCreating ? 'ایجاد شرکت' : 'ذخیره تغییرات'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        انصراف
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{company?.name}</h2>
                                    {company?.industryType && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {industryTypes.find(i => i.value === company.industryType)?.label || company.industryType}
                                        </p>
                                    )}
                                </div>

                                {company?.description && (
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-right">
                                        {company.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    {company?.website && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {company.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                    {company?.location?.city && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            {company.location.city}, {company.location.state} {company.location.country}
                                        </div>
                                    )}
                                    {company?.phone && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            {company.phone}
                                        </div>
                                    )}
                                    {company?.email && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            {company.email}
                                        </div>
                                    )}
                                    {company?.companySize && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            {companySizes.find(s => s.value === company.companySize)?.label || company.companySize}
                                        </div>
                                    )}
                                    {company?.foundedYear && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            تاسیس در {company.foundedYear}
                                        </div>
                                    )}
                                    {company?.companyType && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            {companyTypes.find(t => t.value === company.companyType)?.label || company.companyType}
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                {company?.socialLinks && company.socialLinks.length > 0 && (
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {company.socialLinks.map((link: any, index: number) => {
                                            const platform = socialPlatforms.find(p => p.value === link.platform);
                                            return (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <span className="sr-only">{platform?.label || link.platform}</span>
                                                    {link.platform === 'linkedin' && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                        </svg>
                                                    )}
                                                    {link.platform === 'twitter' && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.968-12.372c0-.21-.005-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                        </svg>
                                                    )}
                                                    {link.platform === 'facebook' && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                    )}
                                                    {link.platform === 'instagram' && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                        </svg>
                                                    )}
                                                    {link.platform === 'youtube' && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                        </svg>
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Stats Cards - Only show when company exists */}
            {!isCreating && company && !isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">کل مشاغل</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{company.totalJobs || 0}</p>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">مشاغل فعال</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{company.activeJobs || 0}</p>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">کل درخواست‌ها</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{company.totalApplications || 0}</p>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">استخدام‌ها</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{company.totalHires || 0}</p>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CompanyProfilePage;