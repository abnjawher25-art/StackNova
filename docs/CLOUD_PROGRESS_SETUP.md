# إعداد الحفظ السحابي الاختياري في StackNova

يستمر StackNova في حفظ التقدم محليًا عند استخدامه دون حساب. تفعيل الحساب والمزامنة السحابية اختياري، ويحتاج إلى مشروع Supabase وقاعدة بيانات مُهيّأة.

## 1. إنشاء مشروع Supabase

1. أنشئ مشروعًا في https://supabase.com/dashboard.
2. افتح SQL Editor في المشروع.
3. نفّذ SQL الموجود في القسم التالي.
4. من إعدادات المشروع افتح Project Settings → API وانسخ Project URL وPublishable/anon key.

## 2. إنشاء جدول التقدم وسياسات الخصوصية

نفّذ هذا النص في SQL Editor:

```sql
create table if not exists public.stacknova_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.stacknova_progress enable row level security;

grant select, insert, update on public.stacknova_progress to authenticated;

drop policy if exists "Users can read their own StackNova progress"
  on public.stacknova_progress;
create policy "Users can read their own StackNova progress"
  on public.stacknova_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own StackNova progress"
  on public.stacknova_progress;
create policy "Users can create their own StackNova progress"
  on public.stacknova_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own StackNova progress"
  on public.stacknova_progress;
create policy "Users can update their own StackNova progress"
  on public.stacknova_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

تضمن سياسات RLS أن المستخدم المسجّل لا يستطيع قراءة أو تعديل تقدم حساب آخر. لا تستخدم service_role key في الواجهة الأمامية.

## 3. إضافة متغيرات البيئة في Vercel

افتح مشروع StackNova في Vercel ثم Settings → Environment Variables وأضف:

- NEXT_PUBLIC_SUPABASE_URL: عنوان مشروع Supabase.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: مفتاح النشر العام (anon/publishable) للمشروع.

أضف المتغيرين إلى Production وPreview وDevelopment بحسب حاجتك، ثم أعد نشر المشروع. لا تضع أي مفاتيح سرية في GitHub أو داخل الكود.

للتطوير المحلي، أضف المتغيرين نفسيهما إلى ملف .env.local (ولا ترفع هذا الملف إلى GitHub).

## 4. إعداد تأكيد البريد

من إعدادات Authentication → URL Configuration في Supabase، أضف عنوان موقع StackNova إلى Site URL وRedirect URLs. أضف أيضًا عنوان معاينة Vercel الذي ستختبر عليه الحسابات. قد يحتاج المستخدم إلى تأكيد بريده قبل أول تسجيل دخول، حسب إعدادات مزوّد البريد في Supabase.

## 5. السلوك المتوقع

- لا يحتاج التعلم إلى حساب.
- عند تسجيل الدخول، تتم مزامنة التقدم المحلي مع السجل السحابي، مع الاحتفاظ بأعلى عدد محاولات وبحالة الإتقان إذا تحققت في أحد المصدرين.
- عند تبديل الحساب على المتصفح نفسه، لا يُدمج التقدم المحلي المرتبط بحساب آخر في الحساب الجديد.
- عند تسجيل الخروج، يُعاد التقدم المحلي السابق للضيف إن وُجد.
- كل تحديث للتقدم يُرسل إلى جدول stacknova_progress بواسطة جلسة المستخدم، وتفرض قاعدة البيانات سياسات الوصول.

## التحقق بعد الإعداد

1. أنشئ حسابًا من صفحة /account وسجّل الدخول.
2. أتقن درسًا ثم افتح لوحة تقدمي.
3. افحص صف المستخدم في stacknova_progress من لوحة Supabase.
4. افتح StackNova على متصفح أو جهاز آخر، وسجّل الدخول بالحساب نفسه، وتحقق من استعادة الدروس المتقنة.
5. سجّل الخروج وتأكد أن المنصة ما زالت قابلة للاستخدام محليًا.
