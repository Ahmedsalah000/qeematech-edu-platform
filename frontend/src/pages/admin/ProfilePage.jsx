import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileAPI } from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { School, Phone, MapPin, Camera } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const getImageUrl = (path) => {
    if (!path) return null;
    const sPath = String(path).trim();
    if (sPath.includes('http://') || sPath.includes('https://')) return sPath;
    return `${API_URL}${sPath.startsWith('/') ? sPath : '/' + sPath}`;
}

const ProfilePage = () => {
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    })
    const [logoFile, setLogoFile] = useState(null)

    // Fetch profile
    const { data: profile, isLoading } = useQuery({
        queryKey: ['schoolProfile'],
        queryFn: async () => {
            const res = await profileAPI.get()
            return res.data
        },
        onSuccess: (data) => {
            setFormData({
                name: data?.name || '',
                phone: data?.phone || '',
                address: data?.address || '',
            })
        },
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data) => profileAPI.updateSchool(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schoolProfile'] })
            setIsEditing(false)
            setLogoFile(null)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { ...formData }
        if (logoFile) {
            data.logo = logoFile
        }
        updateMutation.mutate(data)
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4 max-w-2xl">
                <div className="h-40 skeleton rounded-xl" />
                <div className="h-60 skeleton rounded-xl" />
            </div>
        )
    }

    return (
        <div className="animate-fadeIn max-w-2xl">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <School className="text-[var(--primary)]" />
                School Profile
            </h1>

            {/* Profile Card */}
            <Card hover={false} className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 min-w-0">
                    {/* Logo */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
                            {profile?.logo ? (
                                <img
                                    src={getImageUrl(profile.logo)}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                                    <span className="text-white font-bold text-2xl">
                                        {profile?.name?.charAt(0) || 'Q'}
                                    </span>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--primary)] cursor-pointer hover:bg-[var(--primary-hover)] transition-colors">
                                <Camera size={16} className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setLogoFile(e.target.files[0])}
                                />
                            </label>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] truncate">{profile?.name}</h2>
                        <p className="text-[var(--text-secondary)] truncate">{profile?.email}</p>
                        <span className="badge badge-success mt-2">Admin</span>
                    </div>
                </div>
            </Card>

            {/* Edit Form */}
            <Card hover={false}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="School Name"
                        icon={School}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <Input
                        label="Phone Number"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <Input
                        label="Address"
                        icon={MapPin}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <div className="flex gap-3 pt-4">
                        {isEditing ? (
                            <>
                                <Button type="submit" isLoading={updateMutation.isPending}>
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button type="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default ProfilePage
