// src/Pages/EditChannel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditChannel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    channelName: '',
    description: '',
    channelBanner: '',
  });
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Fetch existing channel details
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/api/channels/${id}`);
        const data = res.data.channel || res.data;
        setForm({
          channelName: data.channelName || '',
          description: data.description || '',
          channelBanner: data.channelBanner || '',
        });
        setBannerPreview(data.channelBanner || null);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load channel data.');
      }
    };
    fetchChannel();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadBanner = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setBannerPreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'Youtube-clone');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/djthu0xcg/image/upload',
        data
      );
      setForm(prev => ({ ...prev, channelBanner: res.data.secure_url }));
      toast.success('Banner uploaded!');
    } catch (err) {
      console.error(err);
      toast.error('Banner upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4001/api/channels/${id}`,
        form,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      toast.success('Channel updated!');
      setTimeout(() => navigate(`/profile/${id}`), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-800 min-h-screen p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-lg bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Edit Channel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="channelName" className="block mb-1">Name</label>
            <input
              name="channelName"
              id="channelName"
              value={form.channelName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">Description</label>
            <input
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>
          <div>
            <label htmlFor="banner" className="block mb-1">Banner Image</label>
            <input
              id="banner"
              type="file"
              accept="image/*"
              onChange={uploadBanner}
              disabled={loading}
              className="file:bg-gray-700 file:text-white"
            />
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="mt-2 w-full h-40 object-cover rounded"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:bg-gray-600"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditChannel;
