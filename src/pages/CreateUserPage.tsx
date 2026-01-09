import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Input } from '@/components/Input';
import { usersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface UserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  tin: string;
  companyName: string;
  role: string;
}

const ROLE_OPTIONS = ['ADMIN', 'SUPPORT', 'SELLER', 'BUYER'];

const INITIAL_FORM_STATE: UserFormData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  tin: '',
  companyName: '',
  role: 'SELLER',
};

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = window.location.pathname;
  const isEditing = location.includes('/edit');
  const isViewing = location.includes('/view');

  const [formData, setFormData] = React.useState<UserFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [isLoadingUser, setIsLoadingUser] = React.useState(false);

  // Load user data if editing or viewing
  React.useEffect(() => {
    if ((isEditing || isViewing) && id) {
      setIsLoadingUser(true);
      const fetchUser = async () => {
        try {
          const user = await usersAPI.getById(id);
          setFormData({
            email: user.email || '',
            password: '', // Don't display password
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            tin: user.tin || '',
            companyName: user.companyName || '',
            role: user.role || 'SELLER',
          });
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('Failed to load user details');
        } finally {
          setIsLoadingUser(false);
        }
      };
      fetchUser();
    }
  }, [isEditing, isViewing, id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!isEditing && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEditing && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.tin) newErrors.tin = 'TIN is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // For editing, don't send password if empty
      const submitData = isEditing && !formData.password
        ? { ...formData, password: undefined }
        : formData;

      if (isEditing && id) {
        await usersAPI.update(id, submitData);
        toast.success('User updated successfully!');
      } else {
        await usersAPI.create(formData);
        toast.success('User created successfully!');
      }

      navigate('/dashboard/users');
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save user. Please try again.';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/users')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">
              {isViewing ? 'View User' : isEditing ? 'Edit User' : 'Create New User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isViewing
                ? 'User details'
                : isEditing
                  ? 'Update user information'
                  : 'Add a new user to your platform'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingUser && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading user details...</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!isLoadingUser && (
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      disabled={isViewing}
                    />

                    <Input
                      label="Last Name"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      disabled={isViewing}
                    />
                  </div>

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    disabled={isViewing}
                  />

                  <Input
                    label={isEditing ? 'Password (Leave empty to keep current)' : 'Password'}
                    name="password"
                    type="password"
                    placeholder={isEditing ? 'Leave empty to keep current password' : 'Enter password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    disabled={isViewing}
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    disabled={isViewing}
                  />

                  <Input
                    label="TIN"
                    name="tin"
                    type="text"
                    placeholder="Enter TIN"
                    value={formData.tin}
                    onChange={handleInputChange}
                    error={errors.tin}
                    disabled={isViewing}
                  />

                  <Input
                    label="Company Name"
                    name="companyName"
                    type="text"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    error={errors.companyName}
                    disabled={isViewing}
                  />

                  <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-foreground">
                      Role <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={isViewing}
                      className={`w-full h-11 px-4 py-2 rounded-lg border bg-card shadow-sm transition-all duration-200
                        placeholder:text-muted-foreground
                        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background focus:border-primary
                        disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted
                        ${errors.role ? 'border-destructive focus:ring-destructive' : 'border-input hover:border-primary/50'}
                      `}
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submit Actions */}
              {!isViewing && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/users')}
                      className="w-full px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* View Mode - Back Button */}
              {isViewing && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/users')}
                    className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    Back to Users
                  </button>
                </div>
              )}

              {/* Help */}
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Tips</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Use a valid email address</li>
                  <li>• Password must be at least 6 characters</li>
                  <li>• Fill in all required fields</li>
                  <li>• Role determines user permissions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}
        </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateUserPage;
